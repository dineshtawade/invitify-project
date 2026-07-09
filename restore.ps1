$transcriptPath = "C:\Users\Dinesh Tawade\.gemini\antigravity-ide\brain\b508ce51-9701-4c3b-a169-3d809fa35a9f\.system_generated\logs\transcript_full.jsonl"
$line = Get-Content -Path $transcriptPath | Select-Object -Index 338 # 0-indexed, so 338 is line 339
$line | Out-File -FilePath "c:\xampp\htdocs\Invitify-new\matched_entry.json" -Encoding utf8
Write-Output "Successfully extracted line 339 to matched_entry.json!"
