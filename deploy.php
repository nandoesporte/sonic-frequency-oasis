
<?php
// Simple deployment script for shared hosting
// Place this in your web directory

// Configuration
$repo_name = 'your-github-username/your-repo-name';
$branch = 'main';
$build_dir = 'dist';
$deploy_dir = __DIR__;

// Output information
echo "<h1>Deployment Process</h1>";
echo "<pre>";

// Create temporary directory
$temp_dir = sys_get_temp_dir() . '/deploy_' . time();
mkdir($temp_dir, 0755, true);
echo "Created temporary directory: $temp_dir\n";

// Clone repository
echo "Cloning repository $repo_name ($branch branch)...\n";
exec("git clone -b $branch --single-branch https://github.com/$repo_name.git $temp_dir 2>&1", $output, $return_var);
echo implode("\n", $output) . "\n";

if ($return_var !== 0) {
    echo "Error: Failed to clone repository.\n";
    exit(1);
}

// Install dependencies and build
echo "Installing dependencies...\n";
exec("cd $temp_dir && npm install 2>&1", $output, $return_var);
echo implode("\n", $output) . "\n";

echo "Building project...\n";
exec("cd $temp_dir && npm run build 2>&1", $output, $return_var);
echo implode("\n", $output) . "\n";

// Deploy to web directory
echo "Deploying to $deploy_dir...\n";

// Copy build files to deployment directory
$build_path = "$temp_dir/$build_dir";
if (!is_dir($build_path)) {
    echo "Error: Build directory not found.\n";
    exit(1);
}

// Function to copy files recursively
function copyDirectory($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    
    while (($file = readdir($dir)) !== false) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                copyDirectory($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
                echo "Copied: $file\n";
            }
        }
    }
    
    closedir($dir);
}

copyDirectory($build_path, $deploy_dir);

// Cleanup
echo "Cleaning up...\n";
exec("rm -rf $temp_dir", $output, $return_var);

echo "Deployment complete!\n";
echo "</pre>";
?>
