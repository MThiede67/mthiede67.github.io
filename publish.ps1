<#
publish.ps1 - Initialize, commit, and push this project to a Git remote.

Usage examples:
  # Use default remote (set below) and branch 'main'
  .\publish.ps1

  # Specify a remote URL and branch
  .\publish.ps1 -Remote "https://github.com/MThiede67/KFP.git" -Branch main

  # If you already authenticated with gh/credential manager, this will push without prompting.

Notes:
- Do NOT embed tokens in the remote URL. Authenticate via `gh auth login` or Windows Credential Manager.
- Run this from the project root (where index.html is located).
#>
param(
    [string]$Remote = "https://github.com/MThiede67/KFP.git",
    [string]$Branch = "main",
    [switch]$ForceRemote
)

function Exec-Git {
    param($Args)
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "git"
    $psi.Arguments = $Args
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $p = New-Object System.Diagnostics.Process
    $p.StartInfo = $psi
    $p.Start() | Out-Null
    $stdout = $p.StandardOutput.ReadToEnd()
    $stderr = $p.StandardError.ReadToEnd()
    $p.WaitForExit()
    return @{ ExitCode = $p.ExitCode; StdOut = $stdout; StdErr = $stderr }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed or not in PATH. Install Git for Windows: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Ensure running in a folder containing the site
$cwd = Get-Location
Write-Host "Running publish from: $cwd"

# Initialize repo if necessary
if (-not (Test-Path -Path ".git")) {
    Write-Host "Initializing new git repository..."
    $r = Exec-Git "init"
    if ($r.ExitCode -ne 0) { Write-Host $r.StdErr -ForegroundColor Red; exit $r.ExitCode }
}
else {
    Write-Host "Existing git repository detected."
}

# Add files
Write-Host "Staging files..."
$r = Exec-Git "add -A"
if ($r.ExitCode -ne 0) { Write-Host $r.StdErr -ForegroundColor Red; exit $r.ExitCode }

# Commit (allow empty when nothing to commit)
Write-Host "Creating commit..."
$r = Exec-Git "commit -m ""chore: initial scaffold for Kerry's Fine Painting website"""
if ($r.ExitCode -ne 0) {
    if ($r.StdErr -match "nothing to commit") {
        Write-Host "No changes to commit." -ForegroundColor Yellow
    } else {
        Write-Host $r.StdErr -ForegroundColor Red
        # continue even if commit failed in case repo already has commits
    }
} else {
    Write-Host "Commit created." -ForegroundColor Green
}

# Set branch
Write-Host "Setting branch to '$Branch'..."
$r = Exec-Git "branch -M $Branch"
if ($r.ExitCode -ne 0) { Write-Host $r.StdErr -ForegroundColor Red; exit $r.ExitCode }

# Configure remote
$hasOrigin = $false
$r = Exec-Git "remote get-url origin"
if ($r.ExitCode -eq 0) { $hasOrigin = $true }

if ($hasOrigin -and -not $ForceRemote) {
    Write-Host "Remote 'origin' already configured to:`n$r.StdOut`nUse -ForceRemote to overwrite." -ForegroundColor Yellow
} else {
    if ($hasOrigin -and $ForceRemote) {
        Write-Host "Overwriting existing 'origin' remote..."
        $r = Exec-Git "remote set-url origin $Remote"
    } else {
        Write-Host "Adding remote origin -> $Remote"
        $r = Exec-Git "remote add origin $Remote"
    }
    if ($r.ExitCode -ne 0) { Write-Host $r.StdErr -ForegroundColor Red; exit $r.ExitCode }
}

# Push
Write-Host "Pushing to origin/$Branch..."
$r = Exec-Git "push -u origin $Branch"
if ($r.ExitCode -ne 0) {
    Write-Host $r.StdErr -ForegroundColor Red
    Write-Host "Push failed. If this is an authentication error, authenticate first with GitHub CLI: `gh auth login` or configure credential manager:`n  git config --global credential.helper manager-core`" -ForegroundColor Yellow
    exit $r.ExitCode
}

Write-Host "Push completed successfully." -ForegroundColor Green

exit 0
