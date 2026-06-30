$jsonRaw = Get-Content -Path "c:\xampp\htdocs\Invitify-new\matched_entry.json" -Raw
$jsonObj = ConvertFrom-Json $jsonRaw

Write-Output "Step Type: $($jsonObj.type)"

if ($jsonObj.type -eq "PLANNER_RESPONSE" -or $jsonObj.type -eq "MODEL") {
    $toolCall = $jsonObj.tool_calls[0]
    Write-Output "Tool Call Name: $($toolCall.name)"
    if ($toolCall.name -eq "write_to_file") {
        $code = $toolCall.args.CodeContent
        $code | Out-File -FilePath "c:\xampp\htdocs\Invitify-new\resources\js\pages\super-admin\settings\index.tsx" -Encoding utf8
        Write-Output "Successfully restored full file to settings/index.tsx (Length: $($code.Length))"
    } elseif ($toolCall.name -eq "replace_file_content") {
        $code = $toolCall.args.ReplacementContent
        $code | Out-File -FilePath "c:\xampp\htdocs\Invitify-new\restored_chunk.tsx" -Encoding utf8
        Write-Output "Extracted replacement chunk to restored_chunk.tsx (Length: $($code.Length))"
    }
}
