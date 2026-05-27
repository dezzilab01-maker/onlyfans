<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = ltrim($_POST['username'], '@');
    $filename = "@{$username}.html";
    
    // Zapisz zdjęcia
    $avatar_path = "uploads/avatars/{$username}.jpg";
    $banner_path = "uploads/banners/{$username}.jpg";
    
    move_uploaded_file($_FILES['avatar']['tmp_name'], $avatar_path);
    move_uploaded_file($_FILES['banner']['tmp_name'], $banner_path);
    
    // Treść strony profilu
    $html = '<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>' . htmlspecialchars($_POST['display_name']) . ' | FanClub</title>
        <style>
            body{font-family:Arial;background:#000;color:#fff;margin:0}
            .banner{width:100%;height:300px;background:linear-gradient(135deg,#ff2e63,#6a0572);background-image:url("' . $banner_path . '");background-size:cover}
            .avatar{width:120px;height:120px;border-radius:50%;border:4px solid #ff2e63;margin-top:-60px;margin-left:20px}
            .container{max-width:800px;margin:0 auto;padding:20px}
            .name{font-size:28px;font-weight:bold}
            .username{color:#ff2e63}
            .bio{background:#111;padding:20px;border-radius:20px;margin-top:20px}
        </style>
    </head>
    <body>
        <div class="banner"></div>
        <div class="container">
            <img class="avatar" src="' . $avatar_path . '">
            <div class="name">' . htmlspecialchars($_POST['display_name']) . '</div>
            <div class="username">@' . htmlspecialchars($username) . '</div>
            <div class="bio">' . nl2br(htmlspecialchars($_POST['bio'])) . '</div>
        </div>
    </body>
    </html>';
    
    file_put_contents($filename, $html);
    header("Location: {$filename}");
}
?>
