param(
    [Parameter(Mandatory = $True)]
    [String]$Workspace
)

. "$Workspace\CloudTest\Scripts\CloudTestHelper.ps1"

$env:Path += ";C:\Program Files\nodejs\"
$env:Path += ";C:\Program Files\WindowsPowerShell\Modules\"

$ConfigFileContent = Get-Content -Path "$Workspace\CloudTest\Config.json"  | ConvertFrom-Json
$E2ETestLoginCredential = Get-SecretFromKeyVaultWithCloudTestCert -keyVaultName $ConfigFileContent.PartnerTeamKeyVaultName -secretName $ConfigFileContent.PartnerTeamLoginSecretName -tenantId $ConfigFileContent.PartnerTeamTenantId -CertificateSubjectName $ConfigFileContent.PartnerTeamSubjectName -aadApplicationId $ConfigFileContent.PartnerTeamCloudTestApplicationId
$timestamp = (Get-Date -Format "MMddyyyy_HHmmss")

Save-PasswordToCredentialsManager -target "SECRET_PATH" -username $ConfigFileContent.PartnerTeamLoginSecretName -secretValue $E2ETestLoginCredential | Out-Null

Set-Location (Join-Path $Workspace "Default\Extension.E2ETests")
Write-Host "Executing E2E tests...($timestamp)"

npm run e2e

Remove-Item -LiteralPath "node_modules" -Force -Recurse

Write-Host "Finished executing E2E tests and copying results.."

$loggingDirectory = if ($env:LoggingDirectory) { $env:LoggingDirectory } else { $workspace }
$trxResultsFullPath = (Join-Path $Workspace "\Default\Extension.E2ETests\result.trx")
$ScreenshotsDir = "$Workspace\Default\Extension.E2ETests\Screenshots"
if (Test-Path -Path $ScreenshotsDir) {
    Copy-Item $ScreenshotsDir "$env:LoggingDirectory\ScreenshotsTakenDir" -Recurse
}

Set-Location $env:LoggingDirectory;
$destination = "E2ETests-results.trx"
Copy-Item $trxResultsFullPath $destination

Write-Host "Finished copying all result files to CloudTest LoggingDirectory";
