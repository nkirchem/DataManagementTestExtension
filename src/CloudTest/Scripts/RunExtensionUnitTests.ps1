param(
    [Parameter(Mandatory = $True)]
    [String]$Workspace
)
."$Workspace\CloudTest\Scripts\CloudTestHelper.ps1"
$env:Path += ";C:\Program Files\nodejs\"

if ($env:SkipUnitTests -contains "true") {
    Write-Host "Skipping execution of Unit tests. Confirm the environment variable SkipUnitTests in the pipeline."
    exit 0
}

Write-Host "Setting up unit tests environment..."
$env:Workspace = $Workspace

Push-Location (Join-Path $workspace "Default\Extension.UnitTests")

$timestamp = (Get-Date).ToString("HH:mm:ss tt")
Write-Host "Executing Unit tests...($timestamp)"

npm install --no-color --no-optional
npm run test

Remove-Item -LiteralPath "node_modules" -Force -Recurse

Write-Host "Finished executing Unit tests and copying results..."

$loggingDirectory = if ($env:LoggingDirectory) { $env:LoggingDirectory } else { $workspace }
$trxResultsFullPath = (Join-Path $workspace "Default\Extension.UnitTests\TestResults\*")
Copy-Item $trxResultsFullPath $loggingDirectory

Pop-Location
