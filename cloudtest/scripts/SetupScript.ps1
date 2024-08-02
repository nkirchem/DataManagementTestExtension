param(
    [Parameter(Mandatory = $True)]
    [String]$Workspace
)
. "$Workspace\cloudtest\scripts\CloudTestHelper.ps1"

#Install node if not already installed
$nodeVersion = (node -v)
if ($nodeVersion -like "v*") {
    Write-Host "Node $nodeVersion, OK"
}
else {
    Write-Host "Installing Node for Unit tests..."
    $nodeJsInstallUrl = "https://nodejs.org/dist/v16.16.0/node-v16.16.0-x64.msi"
    DownloadAndInstallMsi -DownloadUrl $nodeJsInstallUrl -AppName "Node.js"
    $env:Path += ";C:\Program Files\nodejs\"
    $nodeInstalledVersion = (node -v)
    Write-Host "Node version $nodeInstalledVersion installation is completed."
}

#Install npm if not already installed
$npmVersion = (npm -v)
if ($npmVersion -like "v*") {
    Write-Host "Current npm version: $npmVersion"
}
else {
    Write-Host "Installing latest npm version"
    npm install npm@latest -g
}

Write-Host "Checking Chrome version..."
try {
    $chromeVersion = (Get-Item (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe').'(Default)').VersionInfo.ProductVersion
    Write-Host "Chrome v$chromeVersion"
}
catch {
    Write-Warning "WARNING: Could not locate registry key that has chrome.exe path!"
}


#Install azureRM if not already installed
$azureRMVersion = Get-Module -Name AzureRM -ListAvailable
if ($azureRMVersion) {
    Write-Host "AzureRm installed"
}
else {
    Write-Host "Installing AzurRm for running e2etest"
    $azureRMInstallUrl1 = "https://github.com/Azure/azure-powershell/releases/download/v5.0.0-October2020/Az-Cmdlets-5.0.0.33612-x64.msi"
    DownloadAndInstallMsi -DownloadUrl $azureRMInstallUrl1 -AppName "AzureRM"
    $env:Path += ";C:\Program Files\WindowsPowerShell\Modules\"
}
