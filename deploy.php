<?php
// Run only from cPanel Git deployment, never over HTTP.
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
function fail(string $message): never { fwrite(STDERR,$message."\n"); exit(1); }
function put(string $path,string $content): void {
 if (!is_dir(dirname($path)) && !mkdir(dirname($path),0755,true)) fail('Cannot create destination directory');
 $tmp=$path.'.deploy-'.bin2hex(random_bytes(6));
 if(file_put_contents($tmp,$content)===false) fail('Cannot stage '.$path);
 chmod($tmp,0644);
 if(!rename($tmp,$path)) fail('Cannot publish '.$path);
}
$home=$argv[1]??getenv('HOME');
if(!$home || !is_dir($home)) fail('Home directory unavailable');
$lock=fopen($home.'/.course-sites-deploy.lock','c');
if(!$lock || !flock($lock,LOCK_EX|LOCK_NB)) fail('Another deployment is running');
$backup=$home.'/.course-site-backups/'.gmdate('Ymd-His').'-'.bin2hex(random_bytes(3));
if(!mkdir($backup,0700,true)) fail('Cannot create backup');

$targets=[$home.'/eci833.ca/icebreakers',$home.'/public_html/icebreakers'];
$files=['index.html','about.html','app.js','content.js','experience.js','style.css','LICENSE','CONTENT-LICENSE.md'];
$plan=[];
foreach($targets as $i=>$target){
 if(!is_dir($target)) fail('Expected existing site missing: '.$target);
 foreach($files as $file){
  if(!is_file(__DIR__.'/'.$file)) fail('Missing source '.$file);
  if(is_file($target.'/'.$file)) put($backup.'/icebreakers-'.$i.'/'.$file,file_get_contents($target.'/'.$file));
  $plan[$target.'/'.$file]=file_get_contents(__DIR__.'/'.$file);
 }
}
foreach($plan as $path=>$content) put($path,$content);
echo "Published both icebreaker sites. Backup: $backup\n";
