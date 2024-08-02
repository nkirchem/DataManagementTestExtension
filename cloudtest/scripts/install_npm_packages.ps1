param(
    [Parameter(Mandatory = $True)]
    [String]$Workspace,
    [Parameter(Mandatory = $True)]
    [String]$PackageJsonPath
)
#
# Setup .npmrc file for DevOps feed access
#
# The "[Project] Build Service ([Org])" and "Project Collection Build Service ([Org])" accounts should
# have reader access on your feed and the feed must be in the same ADO organization as your pipeline.
# The ADO setting "Limit job authorization scope to current project" will affect which feeds this
# token can access.
#

$ADO_TOKEN = [Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes([Environment]::GetEnvironmentVariable("VstsAccessToken", "User")))
$NPMRC_PATH = "$($env:UserProfile)\.npmrc"

Write-Output "registry=https://msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/" | Out-File $NPMRC_PATH -Encoding ASCII
Write-Output "always-auth=true" | Out-File $NPMRC_PATH -Encoding ASCII -Append
Write-Output "; begin auth token" | Out-File $NPMRC_PATH -Encoding ASCII -Append
Write-Output "//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/:username=msazure" | Out-File $NPMRC_PATH -Encoding ASCII -Append
Write-Output "//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/:_password=$ADO_TOKEN" | Out-File $NPMRC_PATH -Encoding ASCII -Append
Write-Output "//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/:email=npm requires email to be set but doesn't use the value" | Out-File $NPMRC_PATH -Encoding ASCII -Append
Write-Output "//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/:username=msazure" | Out-File $NPMRC_PATH -Encoding ASCII -Append
Write-Output "//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/:_password=$ADO_TOKEN" | Out-File $NPMRC_PATH -Encoding ASCII -Append
Write-Output "//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/:email=npm requires email to be set but doesn't use the value" | Out-File $NPMRC_PATH -Encoding ASCII -Append

# Install a package from the private feed
#
# This package can be accessed during the test run
#
$env:Path += ";C:\Program Files\nodejs\"

#set location to the local package.json and npm install the packages
Set-Location (Join-Path $Workspace $PackageJsonPath)

npm install
