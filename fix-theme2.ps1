$files = @(
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\view\[id]\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\try\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\proposals\[id]\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\p\[code]\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\invoice\[id]\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\i\[code]\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\edit\[id]\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\admin\users\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\admin\page.tsx',
    'c:\Users\Pratik\Documents\VSCode\Kalvora\src\app\admin\feedback\page.tsx'
)

foreach ($filePath in $files) {
    if (-not (Test-Path $filePath)) { Write-Host "SKIP: $filePath"; continue }
    $content = [System.IO.File]::ReadAllText($filePath)
    $original = $content

    $content = $content -replace 'bg-\[#0a0a0f\]', 'bg-[#FAFAF8]'
    $content = $content -replace 'bg-\[#0d0d14\]', 'bg-[#F7F6F3]'
    $content = $content -replace 'bg-\[#12121a\]', 'bg-[#F2F0ED]'
    $content = $content -replace 'bg-\[#08080d\]', 'bg-[#F7F6F3]'
    $content = $content -replace 'bg-\[#1a1a2e\]', 'bg-[#F2F0ED]'
    $content = $content -replace 'hover:bg-\[#1a1a2e\]', 'hover:bg-[#F2F0ED]'
    $content = $content -replace 'hover:bg-\[#12121a\]', 'hover:bg-[#F2F0ED]'
    $content = $content -replace 'border-\[#2a2a40\]', 'border-[#E8E4DF]'
    $content = $content -replace 'border-\[#1a1a2e\]', 'border-[#E8E4DF]'
    $content = $content -replace 'hover:border-\[#3a3a55\]', 'hover:border-[#D5D0CA]'
    $content = $content -replace 'hover:border-\[#3a3a50\]', 'hover:border-[#D5D0CA]'
    $content = $content -replace 'text-\[#5a5a70\]', 'text-[#9C9C9C]'
    $content = $content -replace 'text-\[#8888a0\]', 'text-[#6B6B6B]'
    $content = $content -replace 'text-\[#6a6a80\]', 'text-[#9C9C9C]'
    $content = $content -replace 'text-\[#3a3a50\]', 'text-[#C8C4BF]'
    $content = $content -replace 'text-\[#f0f0f5\]', 'text-[#1A1A1A]'
    $content = $content -replace 'text-\[#9090a8\]', 'text-[#6B6B6B]'
    $content = $content -replace 'text-\[#c0c0d0\]', 'text-[#6B6B6B]'
    $content = $content -replace 'text-\[#b0b0c8\]', 'text-[#6B6B6B]'
    $content = $content -replace 'hover:text-\[#8888a0\]', 'hover:text-[#6B6B6B]'
    $content = $content -replace 'hover:text-\[#f0f0f5\]', 'hover:text-[#1A1A1A]'
    $content = $content -replace '"text-white font-semibold', '"text-[#1A1A1A] font-semibold'
    $content = $content -replace '"text-white font-bold', '"text-[#1A1A1A] font-bold'
    $content = $content -replace '"text-white font-medium', '"text-[#1A1A1A] font-medium'
    $content = $content -replace '"text-white text-sm font-semibold', '"text-[#1A1A1A] text-sm font-semibold'
    $content = $content -replace '"text-white text-sm font-medium', '"text-[#1A1A1A] text-sm font-medium'
    $content = $content -replace '"text-white text-sm sm:text-base', '"text-[#1A1A1A] text-sm sm:text-base'
    $content = $content -replace '"text-white text-lg font-semibold', '"text-[#1A1A1A] text-lg font-semibold'
    $content = $content -replace 'font-bold text-white', 'font-bold text-[#1A1A1A]'
    $content = $content -replace 'font-semibold text-white', 'font-semibold text-[#1A1A1A]'
    $content = $content -replace 'hover:text-white', 'hover:text-[#1A1A1A]'
    $content = $content -replace 'ring-\[#0d0d16\]', 'ring-[#FAFAF8]'

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($filePath, $content)
        Write-Host "Updated: $filePath"
    } else {
        Write-Host "No changes: $filePath"
    }
}
Write-Host "Done!"
