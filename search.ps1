$transcriptPath = "C:\Users\Dinesh Tawade\.gemini\antigravity-ide\brain\b508ce51-9701-4c3b-a169-3d809fa35a9f\.system_generated\logs\transcript_full.jsonl"
Select-String -Path $transcriptPath -Pattern "settings/index.tsx" | ForEach-Object {
    if ($_.Line.Length -gt 25000) {
        Write-Output ("Line " + $_.LineNumber + ": Length=" + $_.Line.Length)
    }
}
