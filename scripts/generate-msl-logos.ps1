$ErrorActionPreference = 'Stop'

# Resolve API key (process env -> User scope -> Machine scope -> .env walk-up)
$key = $env:GEMINI_API_KEY
if (-not $key) { $key = $env:GOOGLE_GEMINI_API_KEY }
if (-not $key) { $key = [System.Environment]::GetEnvironmentVariable('GEMINI_API_KEY','User') }
if (-not $key) { $key = [System.Environment]::GetEnvironmentVariable('GEMINI_API_KEY','Machine') }
if (-not $key) {
  $dir = (Get-Location).Path
  while ($dir -and (Test-Path $dir)) {
    $envFile = Join-Path $dir '.env'
    if (Test-Path $envFile) {
      $line = Select-String -Path $envFile -Pattern '^\s*GEMINI_API_KEY\s*=' | Select-Object -First 1
      if ($line) {
        $key = ($line.Line -replace '^\s*GEMINI_API_KEY\s*=\s*','' -replace '^["'']','' -replace '["'']$','').Trim()
        if ($key) { break }
      }
    }
    $parent = Split-Path $dir -Parent
    if (-not $parent -or $parent -eq $dir) { break }
    $dir = $parent
  }
}
if (-not $key) {
  throw "No Gemini API key found. Set GEMINI_API_KEY in env or .env."
}

$model = if ($env:GEMINI_IMAGE_MODEL) { $env:GEMINI_IMAGE_MODEL } else { 'gemini-3.1-flash-image-preview' }
$outDir = 'public/msl-logo-variants'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# Master prompt template — uses [HOOK] placeholder
$masterTemplate = @'
Minimal corporate logo mark for "Mesa Startup Lab," the in-house
incubator sub-brand of Mesa School of Business. Custom monogram icon
plus horizontal wordmark lockup. Production-grade, vector-clean, flat.

ICON TILE:
- Rounded square, corner radius ~24% of side length
- Fill: deep ink green-black, hex #0F1F1C (solid, matte, no gradient,
  no texture)
- Interior optical padding ~14% on all sides
- Centered composition

BASE LETTERFORM (white #FFFFFF, centered inside the tile):
- Lowercase "m" in bold geometric sans-serif, even stroke weight,
  rounded terminals, generous counters
- Two arches of equal width, sitting on the baseline (subject to
  the hook modification below)
- A short horizontal MACRON BAR sits centered above the letter,
  slightly wider than the body of the "m," same stroke weight as
  the letterform (subject to the hook modification below)
- Letterform must remain recognizable as the letter "m" at small sizes

HOOK MODIFICATION:
[HOOK]

WORDMARK LOCKUP (right of icon, vertically centered):
- Line 1: "Mesa" in white, lowercase, same bold geometric sans-serif
  as the icon's letterform, with a horizontal macron bar above its
  lowercase "m"
- Line 2 (left-aligned beneath "Mesa"): "STARTUP LAB" in uppercase
  white, lighter weight, evenly letter-spaced (~180 tracking),
  cap-height ~34% of the "Mesa" wordmark height
- Spacing between icon tile and wordmark: ~half the tile width

CANVAS & OUTPUT:
- Background: deep ink green-black #0F1F1C
- 16:9 horizontal aspect, ample negative space
- Flat vector aesthetic — no shadows, glows, gradients, 3D, textures,
  or outlines around shapes

DESIGN INTENT:
- Must read as obviously part of the Mesa brand family — same tile,
  same color, same wordmark, same macron bar
- The hook modification is the single point of differentiation from
  the parent Mesa School of Business identity
- Premium, founder-grade, operator aesthetic — restrained, not playful

DO NOT include: taglines, decorative elements, rocket illustrations,
lightbulbs, beakers, gears, dollar signs, sparkles, glow effects,
gradient fills, drop shadows, 3D extrusion, or any modification to
the "Mesa" wordmark beyond the sub-label change.
'@

# Hook library — ordered so generation runs predictably
$hooks = [ordered]@{}

$hooks['g1-trajectory-arrow'] = @'
Modify the right side of the "m": instead of the rightmost vertical
stroke dropping to the baseline, it continues UPWARD past the top of
the letterform at approximately 30 degrees up-and-to-the-right,
terminating in a clean chevron arrow tip (two short angled strokes
forming a tight "V"). The arrow stroke weight matches the letterform
exactly. The arrow tip is the highest element in the mark, sitting
above the macron bar.
'@

$hooks['g2-stepped-macron'] = @'
Replace the single macron bar with THREE short horizontal bars of
ascending length, stacked vertically with small even gaps between
them. Leftmost-shortest, middle-medium, rightmost-longest, each
left-aligned to a common left edge so the right edges form an
ascending staircase. The lowest of the three bars sits where the
original macron would sit. Same stroke weight as the letterform.
'@

$hooks['g3-curve-arc-macron'] = @'
Replace the straight horizontal macron bar with a smooth thin arc
that rises from left to right, curving upward like the top of a
growth curve. Same stroke weight as the letterform. The arc spans
the same horizontal range the macron would have occupied, with its
right end sitting noticeably higher than its left end.
'@

$hooks['g4-chart-spike'] = @'
Modify the right arch of the "m": its rightmost vertical stroke
extends STRAIGHT UPWARD past the top of the letterform and past
the macron bar, ending in a clean flat top (no arrow head). The
spike is the same stroke weight as the letterform and reaches a
height roughly 1.6x the letter height, creating a thin vertical
chart-spike silhouette.
'@

$hooks['b1-block-built'] = @'
Render the "m" letterform as if constructed from small uniform
square modules (like pixel blocks or bricks), arranged to form the
two arches and three vertical stems of the letter. The macron bar
above remains a single solid stroke. The modular blocks should be
clearly visible but the letter "m" must still read instantly.
'@

$hooks['b2-foundation-underline'] = @'
Add a second horizontal white bar BENEATH the "m," mirroring the
macron above. The lower bar sits just below the baseline of the
letter, matches the macron's stroke weight, and is the same width
as the macron — creating a symmetrical "framed" sandwich with the
m centered between the two horizontal bars.
'@

$hooks['b3-plus-accent'] = @'
Add a small white "+" symbol positioned just above the right end
of the macron bar, sized roughly 40% of the macron's length. The
plus is rendered in the same stroke weight as the letterform. The
macron and "m" remain unchanged.
'@

$hooks['b4-bracket-frame'] = @'
Flank the "m" with two thin white square brackets, one on each
side: a "[" to the left of the letter and a "]" to the right. The
brackets span only the height of the "m" letterform (not the
macron). Stroke weight matches the letterform. The macron bar
remains centered above the "m," sitting between but above the
two brackets.
'@

$hooks['a1-ignite-spark'] = @'
Add a small white dot (spark) positioned just above the right end
of the macron bar, with a small gap between the dot and the bar.
The dot is roughly the same diameter as the macron's stroke weight.
The "m" and macron remain unchanged.
'@

$hooks['a2-launch-trail'] = @'
Add a thin curved white arc that begins beneath the right foot of
the "m" (below the baseline) and sweeps upward and to the right,
exiting toward the upper-right corner of the tile. The arc reads
as a takeoff/launch trail. Stroke weight slightly thinner than the
letterform. The "m" and macron remain unchanged.
'@

$hooks['a3-velocity-lines'] = @'
Add two or three short horizontal white lines positioned to the
LEFT of the "m," trailing the letter like motion lines. The lines
are stacked vertically, parallel, of varying lengths (longest in
the middle), and sit at mid-letter height. Stroke weight thinner
than the letterform. The "m" and macron remain unchanged.
'@

$hooks['a4-forward-chevron'] = @'
Add a small white ">" chevron mark positioned at the right end of
the macron bar, pointing rightward, sized roughly 60% the macron's
stroke length. The chevron is the same stroke weight as the
letterform. The "m" and macron remain unchanged.
'@

$hooks['l1-aperture-ring'] = @'
Add a thin white circle (outline only, not filled) that encloses
the "m" and macron, concentric with the center of the tile and
slightly inset from the tile edges. Stroke weight thinner than the
letterform. The "m" and macron remain unchanged inside the ring.
'@

$hooks['l2-orbit-dot'] = @'
Add a single small white dot positioned above the macron bar,
offset to the right of center (suggesting orbital motion above the
letter). Dot diameter roughly equal to the macron's stroke weight.
The "m" and macron remain unchanged.
'@

$hooks['l3-node-link'] = @'
Add a single small white dot positioned above and slightly right
of the macron bar, connected to the right end of the macron by a
short thin white line. Together they form a node-and-connector
graphic. Stroke weight of the connector thinner than the
letterform. The "m" and macron remain unchanged.
'@

$hooks['l4-milestone-dots'] = @'
Add three small white dots arranged in an ascending diagonal line
above and to the right of the macron bar (smallest dot at lower-
left, dots spaced evenly, all equal in size). The dots suggest a
milestone progression rising up-and-right. The "m" and macron
remain unchanged.
'@

$uri = "https://generativelanguage.googleapis.com/v1beta/models/$model`:generateContent"
$total = $hooks.Count
$i = 0
$results = @()

foreach ($name in $hooks.Keys) {
  $i++
  $hookText = $hooks[$name]
  $prompt = $masterTemplate -replace '\[HOOK\]', $hookText
  $outPath = Join-Path $outDir "msl-$name.png"

  Write-Host "[$i/$total] Generating $name ..." -ForegroundColor Cyan

  $body = @{
    contents = @(@{ parts = @(@{ text = $prompt }) })
    generationConfig = @{
      responseModalities = @('IMAGE','TEXT')
      imageConfig = @{ aspectRatio = '16:9' }
    }
  } | ConvertTo-Json -Depth 10 -Compress

  $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

  try {
    $resp = Invoke-RestMethod -Uri $uri -Method Post -Body $bodyBytes -TimeoutSec 180 `
      -ContentType 'application/json; charset=utf-8' `
      -Headers @{ 'x-goog-api-key' = $key }

    $imgB64 = $null
    foreach ($p in $resp.candidates[0].content.parts) {
      if ($p.inlineData -and $p.inlineData.data) { $imgB64 = $p.inlineData.data; break }
    }

    if (-not $imgB64) {
      Write-Host "  ! No image returned (finishReason=$($resp.candidates[0].finishReason))" -ForegroundColor Yellow
      $results += [pscustomobject]@{ Hook = $name; Status = 'NO_IMAGE'; Path = $null }
      continue
    }

    [IO.File]::WriteAllBytes($outPath, [Convert]::FromBase64String($imgB64))
    Write-Host "  -> Saved: $outPath" -ForegroundColor Green
    $results += [pscustomobject]@{ Hook = $name; Status = 'OK'; Path = $outPath }
  } catch {
    Write-Host "  ! API error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { Write-Host "    $($_.ErrorDetails.Message)" -ForegroundColor DarkRed }
    $results += [pscustomobject]@{ Hook = $name; Status = 'ERROR'; Path = $null }
  }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize
$ok = ($results | Where-Object Status -eq 'OK').Count
Write-Host "$ok of $total succeeded." -ForegroundColor Cyan
