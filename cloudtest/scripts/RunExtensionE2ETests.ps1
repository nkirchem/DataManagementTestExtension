param(
    [Parameter(Mandatory = $True)]
    [String]$Workspace
)

. "$Workspace\cloudtest\scripts\CloudTestHelper.ps1"

$env:Path += ";C:\Program Files\nodejs\"
$env:Path += ";C:\Program Files\WindowsPowerShell\Modules\"

$ConfigFileContent = Get-Content -Path "$Workspace\cloudtest\Config.json"  | ConvertFrom-Json
$E2ETestLoginCredential = Get-SecretFromKeyVaultWithCloudTestCert -keyVaultName $ConfigFileContent.PartnerTeamKeyVaultName -secretName $ConfigFileContent.PartnerTeamLoginSecretName -tenantId $ConfigFileContent.PartnerTeamTenantId -CertificateSubjectName $ConfigFileContent.PartnerTeamSubjectName -aadApplicationId $ConfigFileContent.PartnerTeamCloudTestApplicationId
$timestamp = (Get-Date -Format "MMddyyyy_HHmmss")

Save-PasswordToCredentialsManager -target "SECRET_PATH" -username $ConfigFileContent.PartnerTeamLoginSecretName -secretValue $E2ETestLoginCredential | Out-Null

Set-Location (Join-Path $Workspace "e2etests")
Write-Host "Executing E2E tests...($timestamp)"

npm run e2e

Remove-Item -LiteralPath "node_modules" -Force -Recurse

Write-Host "Finished executing E2E tests and copying results.."

$loggingDirectory = if ($env:LoggingDirectory) { $env:LoggingDirectory } else { $workspace }
$trxResultsFullPath = (Join-Path $Workspace "\e2etests\result.trx")
$ScreenshotsDir = "$Workspace\e2etests\Screenshots"
if (Test-Path -Path $ScreenshotsDir) {
    Copy-Item $ScreenshotsDir "$env:LoggingDirectory\ScreenshotsTakenDir" -Recurse
}

Set-Location $env:LoggingDirectory;
$destination = "e2etests-results.trx"
Copy-Item $trxResultsFullPath $destination

Write-Host "Finished copying all result files to CloudTest LoggingDirectory";
