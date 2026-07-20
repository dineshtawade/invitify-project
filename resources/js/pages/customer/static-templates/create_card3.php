<!DOCTYPE html>
<?php
require('connect.php');
require('header.php');

// Normalize function
function normalize_url($url) {
    $url = trim($url);
    if (!empty($url) && !parse_url($url, PHP_URL_SCHEME)) {
        return 'https://' . ltrim($url, '/');
    }
    return $url;
}

// Fetch existing data
$query = mysqli_query($connect, 'SELECT * FROM digi_card WHERE id="' . $_SESSION['card_id_inprocess'] . '" AND user_email="' . $_SESSION['user_email'] . '"');
if (mysqli_num_rows($query) == 0) {
    echo '<meta http-equiv="refresh" content="0;URL=index.php">';
    exit;
} else {
    $row = mysqli_fetch_array($query);
}
?>

<div class="main3">
    <div class="navigator_up">
        <a href="select_theme.php"><div class="nav_cont"><i class="fa fa-map"></i> Select Theme</div></a>
        <a href="create_card2.php"><div class="nav_cont"><i class="fa fa-bank"></i> Company Details</div></a>
        <a href="create_card3.php"><div class="nav_cont active"><i class="fa fa-facebook"></i> Social Links</div></a>
        <a href="create_card4.php"><div class="nav_cont"><i class="fa fa-rupee"></i> Payment Options</div></a>
        <a href="create_card5.php"><div class="nav_cont"><i class="fa fa-ticket"></i> Products & Services</div></a>
        <a href="create_card7.php"><div class="nav_cont"><i class="fa fa-archive"></i> Order Page</div></a>
        <a href="create_card6.php"><div class="nav_cont"><i class="fa fa-image"></i> Image Gallery</div></a>
        <a href="preview_page.php"><div class="nav_cont"><i class="fa fa-laptop"></i> Preview Card</div></a>
    </div>

    <div class="btn_holder">
        <a href="create_card2.php"><div class="back_btn"><i class="fa fa-chevron-circle-left"></i> Back</div></a>
        <a href="create_card4.php"><div class="skip_btn">Skip <i class="fa fa-chevron-circle-right"></i></div></a>
    </div>

    <h1>Social Links</h1>

    <form id="card_form" action="" method="POST" enctype="multipart/form-data">
        <h3>Social Media Links</h3>

        <div class="input_box"><p>Facebook Link(Optional)</p><input type="text" name="d_fb" maxlength="200" placeholder="Facebook Link" value="<?php if (!empty($row['d_fb'])) echo $row['d_fb']; ?>"></div>

        <div class="input_box"><p>Twitter Link(Optional)</p><input type="text" name="d_twitter" maxlength="200" placeholder="Twitter Link" value="<?php if (!empty($row['d_twitter'])) echo $row['d_twitter']; ?>"></div>

        <div class="input_box"><p>Instagram Link(Optional)</p><input type="text" name="d_instagram" maxlength="200" placeholder="Instagram Link" value="<?php if (!empty($row['d_instagram'])) echo $row['d_instagram']; ?>"></div>

        <div class="input_box"><p>LinkedIn Link(Optional)</p><input type="text" name="d_linkedin" maxlength="200" placeholder="LinkedIn Link" value="<?php if (!empty($row['d_linkedin'])) echo $row['d_linkedin']; ?>"></div>

        <div class="input_box"><p>YouTube Link(Optional)</p><input type="text" name="d_youtube" maxlength="200" placeholder="YouTube Page Link" value="<?php if (!empty($row['d_youtube'])) echo $row['d_youtube']; ?>"></div>

        <div class="input_box"><p>Pinterest Link(Optional)</p><input type="text" name="d_pinterest" maxlength="200" placeholder="Pinterest Link" value="<?php if (!empty($row['d_pinterest'])) echo $row['d_pinterest']; ?>"></div>

        <h3>YouTube Video Links</h3>

        <div class="input_box"><p>YouTube Video Link (Optional)</p><input type="text" name="d_youtube1" maxlength="200" placeholder="1st YouTube Video Link" value="<?php if (!empty($row['d_youtube1'])) echo $row['d_youtube1']; ?>"></div>

        <div class="input_box"><p>YouTube Video Link 2(Optional)</p><input type="text" name="d_youtube2" maxlength="200" placeholder="2nd YouTube Video Link" value="<?php if (!empty($row['d_youtube2'])) echo $row['d_youtube2']; ?>"></div>

        <div class="input_box"><p>YouTube Video Link 3(Optional)</p><input type="text" name="d_youtube3" maxlength="200" placeholder="3rd YouTube Video Link" value="<?php if (!empty($row['d_youtube3'])) echo $row['d_youtube3']; ?>"></div>

        <div class="input_box"><p>YouTube Video Link 4(Optional)</p><input type="text" name="d_youtube4" maxlength="200" placeholder="4th YouTube Video Link" value="<?php if (!empty($row['d_youtube4'])) echo $row['d_youtube4']; ?>"></div>

        <div class="input_box"><p>YouTube Video Link 5(Optional)</p><input type="text" name="d_youtube5" maxlength="200" placeholder="5th YouTube Video Link" value="<?php if (!empty($row['d_youtube5'])) echo $row['d_youtube5']; ?>"></div>

        <div class="input_box"><p>Google Map(Optional)</p><input type="text" name="d_review" maxlength="200" placeholder="Review Link" value="<?php if (!empty($row['d_review'])) echo $row['d_review']; ?>"></div>

        <input type="submit" class="" name="process3" value="Next 4" id="block_loader">
    </form>

<?php
if (isset($_POST['process3'])) {
    // Normalize URLs before saving
    $d_fb        = normalize_url($_POST['d_fb']);
    $d_twitter   = normalize_url($_POST['d_twitter']);
    $d_instagram = normalize_url($_POST['d_instagram']);
    $d_linkedin  = normalize_url($_POST['d_linkedin']);
    $d_youtube   = normalize_url($_POST['d_youtube']);
    $d_pinterest = normalize_url($_POST['d_pinterest']);

    $d_youtube1  = normalize_url($_POST['d_youtube1']);
    $d_youtube2  = normalize_url($_POST['d_youtube2']);
    $d_youtube3  = normalize_url($_POST['d_youtube3']);
    $d_youtube4  = normalize_url($_POST['d_youtube4']);
    $d_youtube5  = normalize_url($_POST['d_youtube5']);

    $d_review    = normalize_url($_POST['d_review']);

    $query = mysqli_query($connect, 'SELECT * FROM digi_card WHERE id="' . $_SESSION['card_id_inprocess'] . '"');
    if (mysqli_num_rows($query) == 1) {
        $update = mysqli_query($connect, 'UPDATE digi_card SET 
            d_fb="' . $d_fb . '",
            d_twitter="' . $d_twitter . '",
            d_instagram="' . $d_instagram . '",
            d_linkedin="' . $d_linkedin . '",
            d_youtube="' . $d_youtube . '",
            d_pinterest="' . $d_pinterest . '",
            d_youtube1="' . $d_youtube1 . '",
            d_youtube2="' . $d_youtube2 . '",
            d_youtube3="' . $d_youtube3 . '",
            d_youtube4="' . $d_youtube4 . '",
            d_youtube5="' . $d_youtube5 . '",
            d_review="' . $d_review . '"
            WHERE id="' . $_SESSION['card_id_inprocess'] . '"
        ');

        if ($update) {
            echo '<a href="create_card4.php"><div class="alert info">Details Updated Wait...</div></a>';
            echo '<meta http-equiv="refresh" content="0;URL=create_card4.php">';
            echo '<style>form {display:none;}</style>';
        } else {
            echo '<a href="create_card3.php"><div class="alert danger">Error! Try Again.</div></a>';
        }
    } else {
        echo '<a href="create_card.php"><div class="alert danger">Detail Not Available. Try Again Click here.</div></a>';
    }
}
?>

</div>

<footer class="">
    <p><?php echo $_SERVER['HTTP_HOST']; ?> || 2020</p>
</footer>
