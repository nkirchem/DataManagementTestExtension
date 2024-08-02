param(
    [Parameter(Mandatory = $True)]
    [String]$Workspace
)
."$Workspace\cloudtest\scripts\CloudTestHelper.ps1"

$env:Path += ";C:\Program Files\nodejs\"

Write-Host "Setting up reactviews unit tests environment..."
$env:Workspace = $Workspace

Write-Host "Workspace directory"
Write-Host $Workspace

push-Location("src")
$timestamp = (Get-Date).ToString("HH:mm:ss tt")
Write-Host "*****Executing reactviews Unit tests...($timestamp)*****"

npm install
npm run test

Remove-Item -LiteralPath "node_modules" -Force -Recurse

Write-Host "Finished executing Unit tests and copying results..."
$loggingDirectory = if ($env:LoggingDirectory) { $env:LoggingDirectory } else { $workspace }
$junitResultsFullPath = (Join-Path $Directory "junit.xml")
Copy-Item $junitResultsFullPath $loggingDirectory

pop-Location
