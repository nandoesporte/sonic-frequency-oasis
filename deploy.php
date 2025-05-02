
<?php
$secret = getenv('DEPLOY_SECRET');
$providedSecret = $_SERVER['HTTP_X_DEPLOY_SECRET'] ?? '';

// Check secret
if (!hash_equals($secret, $providedSecret)) {
    http_response_code(403);
    die('Access denied');
}

// Get repository URL from environment
$repoUrl = getenv('REPO_URL');
if (!$repoUrl) {
    $repoUrl = 'https://github.com/YOUR_USERNAME/YOUR_REPO.git';
}

// Deployment directory
$deployDir = __DIR__ . '/dist';

// Output buffer for debugging
$output = '';
$returnCode = 0;

// Create a clean dist directory
if (file_exists($deployDir)) {
    exec('rm -rf ' . escapeshellarg($deployDir), $output, $returnCode);
}
mkdir($deployDir, 0755, true);

// Clone the repository to a temp directory
$tempDir = __DIR__ . '/temp_repo';
if (file_exists($tempDir)) {
    exec('rm -rf ' . escapeshellarg($tempDir), $output, $returnCode);
}

// Clone only the dist folder (sparse checkout)
exec('git clone --depth=1 ' . escapeshellarg($repoUrl) . ' ' . escapeshellarg($tempDir), $output, $returnCode);
if ($returnCode !== 0) {
    die('Failed to clone repository: ' . implode("\n", $output));
}

// Copy dist folder to deployment directory
if (file_exists($tempDir . '/dist')) {
    exec('cp -R ' . escapeshellarg($tempDir . '/dist') . '/* ' . escapeshellarg($deployDir), $output, $returnCode);
    echo "Successfully deployed to dist folder!\n";
} else {
    die('Dist folder not found in repository');
}

// Clean up temporary directory
exec('rm -rf ' . escapeshellarg($tempDir), $output, $returnCode);

echo "Deployment completed successfully!";
?>
