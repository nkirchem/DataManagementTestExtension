function DownloadAndInstallMsi {
    param(
        [string]$DownloadUrl,
        [string]$AppName
    )
    Write-Output "Downloading and installing '$AppName'..."
    $tempPath = "C:\" + [guid]::NewGuid() + ".msi"
    [Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
    (new-object net.webclient).DownloadFile($DownloadUrl, $tempPath)
    $arguments = "/quiet /log ""C:\" + $AppName + "-Setup.log"" ALLUSERS=1"
    $process = Start-Process $tempPath -ArgumentList $arguments -Wait -PassThru

    if ($process.ExitCode -eq 0) {
        Write-Output $AppName" successfully installed."
    }
    else {
        throw $AppName + " exited with non-zero code: $($process.ExitCode). Aborting..."
    }

    Remove-Item $tempPath
}

function DownloadAndInstallExe {
    param(
        [string]$DownloadUrl,
        [string]$InstallerPath,
        [string]$AppName
    )
    Write-Output "Downloading and installing '$AppName'..."
    Invoke-WebRequest $DownloadUrl -OutFile $InstallerPath
    Start-Process -FilePath $InstallerPath -Args "/silent /install" -Verb RunAs -Wait
    Write-Output $AppName" successfully installed."
    Remove-Item $InstallerPath
}

function With-Retry($Command) {
    $retryCount = 0;
    $success = $false;
    do {
        try {
            & $Command;
            $success = $true;
        }
        catch {
            if ($retryCount -gt 5) {
                throw;
            }
            else {
                Write-Warning "Retry of command, retryCount:$retryCount";
                Start-Sleep -s 10;
            }
            ++$retryCount;
        }
    } while (!$success);
}

function Get-SecretFromKeyVaultWithCloudTestCert {
    param(
        [Parameter(Mandatory = $True)]
        [String]$keyVaultName,
        [Parameter(Mandatory = $True)]
        [String]$secretName,
        [Parameter(Mandatory = $True)]
        [String]$tenantId,
        [Parameter(Mandatory = $True)]
        [String]$certificateSubjectName,
        [Parameter(Mandatory = $True)]
        [String]$aadApplicationId
    )

    $cloudTestCertificateSubjectName = "CN=$($certificateSubjectName)"
    $cloudTestApplicationId = $aadApplicationId
    $teamTenantId = $tenantId
    Write-Host "Fetching Credentials from KeyVault..."
    $certs = Get-ChildItem -Path Cert:\LocalMachine\ -Recurse | Where-Object { $_.Subject -eq $cloudTestCertificateSubjectName }
    $certThumbprint = $certs[0].Thumbprint
    With-Retry({ Connect-AzureRmAccount -ServicePrincipal -CertificateThumbprint $certThumbprint -ApplicationId $cloudTestApplicationId -TenantId $teamTenantId })
    $secretValue = (Get-AzureKeyVaultSecret -VaultName $keyVaultName -Name $secretName).SecretValueText
    return $secretValue
}

function Save-PasswordToCredentialsManager {
    param(
        [Parameter(Mandatory = $True)]
        [String]$target,
        [Parameter(Mandatory = $True)]
        [String]$username,
        [Parameter(Mandatory = $True)]
        [String]$secretValue
    )

    if (-not (Get-Module -Name CredentialManager -ListAvailable)) {
        Write-Host "Installing Credentials Manager module..."
        Install-Module -Name CredentialManager -Force
    }

    Import-Module -Name CredentialManager -Force
    New-StoredCredential -Target $target -Username $username -Password $secretValue | Out-Null  #we can then use ncof to grab our secret value
}
