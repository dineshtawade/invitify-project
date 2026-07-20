<!DOCTYPE html> 
 <?php

require('connect.php');
require('header.php');


// sender token script


$query_customer=mysqli_query($connect,'SELECT * FROM customer_login WHERE user_email="'.$_SESSION['user_email'].'"');
$row_customer=mysqli_fetch_array($query_customer);
if(!empty($row_customer['sender_token'])){
	
	$query_franchisee=mysqli_query($connect,'SELECT * FROM franchisee_login WHERE id="'.$row_customer['sender_token'].'"');
	$row_franchisee=mysqli_fetch_array($query_franchisee);
	
$franchisee_email=$row_franchisee['f_user_email'];
}else {
	$franchisee_email="";
}



?>


<div class="main3">
	<div class="btn_holder">
		<a href="index.php"><div class="back_btn"><i class="fa fa-chevron-circle-left"></i> Back</div></a>
		<a href="select_theme.php"><div class="skip_btn">Skip <i class="fa fa-chevron-circle-right"></i></div></a>
	</div>
	
<?php
if(isset($_GET['card_number'])){
		$_SESSION['card_id_inprocess']=$_GET['card_number'];
		$query=mysqli_query($connect,'SELECT * FROM digi_card WHERE id="'.$_SESSION['card_id_inprocess'].'" AND user_email="'.$_SESSION['user_email'].'" ');


	$row=mysqli_fetch_array($query);
	
	if(mysqli_num_rows($query)==0){echo '<div class="alert danger">Card id Removed/Not available.</div>';}else {
		
	
	// updte comp name
	?>
	
	<h1>Update Business or Company Name</h1>
	
	<form action="#" method="POST" class="close_form" enctype="multipart/form-data">
		<div class="input_box"><p>Company Name *</p><input type="text" name="d_comp_name" maxlength="199" value="<?php echo $row['d_comp_name']; ?>" placeholder="Enter Company Name" required></div>
		
			
		<input type="submit" class="" name="process2" value="Submit & Next" >
	
	
	</form>
	
	<?php
		}
		
	}else {
		?>
	<h1>Business or Company Name</h1>
	
	<form action="#" method="POST" class="close_form" enctype="multipart/form-data">
		<div class="input_box"><p>Company Name *</p><input type="text" name="d_comp_name" maxlength="199" value="" placeholder="Enter Company Name" required></div>
		
			
		<input type="submit" class="" name="process1" value="Submit & Next" >
	
	
	</form>
	
	
	
	<?php
	}
	


	// update comp name end


?>




<?php
// u[pdate comp name funtion

	if(isset($_POST['process2'])){	
	$query=mysqli_query($connect,'SELECT * FROM digi_card WHERE d_comp_name="'.$_POST['d_comp_name'].'"  ORDER BY id DESC');
	$row=mysqli_fetch_array($query);
	
	if(mysqli_num_rows($query)==0){
		
		 $card_id=str_replace(array(' ','.','&','/','','[',']'),array('-','','','-','',''),$_POST['d_comp_name']);
		
		$update=mysqli_query($connect,'UPDATE digi_card SET d_comp_name="'.$_POST['d_comp_name'].'", card_id="'.$card_id.'" WHERE id="'.$_SESSION['card_id_inprocess'].'"');
				echo '<meta http-equiv="refresh" content="1;URL=select_theme.php">';
				echo '<style>  form {display:none;} </style>';
				echo '<div class="alert success">Company Name Updated</div>';
	}else {
		
			if($row['d_comp_name']=$_POST['d_comp_name'] && $row['id']=$_SESSION['card_id_inprocess']){
				echo '<style>  form {display:none;} </style>';
				echo '<meta http-equiv="refresh" content="1;URL=select_theme.php">';
				echo '<div class="alert info">Redirecting...</div>';
			}else{
		// if comp name is not availble in the same id then create new one
		
		$count=mysqli_num_rows($query);
			
		 $card_id=str_replace(array(' ','.','&','/','','[',']'),array('-','','','-','',''),$_POST['d_comp_name']).($count+1);
			$update=mysqli_query($connect,'UPDATE digi_card SET d_comp_name="'.$_POST['d_comp_name'].'", card_id="'.$card_id.'" WHERE id="'.$_SESSION['card_id_inprocess'].'"');
				echo '<meta http-equiv="refresh" content="1;URL=select_theme.php">';
				echo '<style>  form {display:none;} </style>';
				echo '<div class="alert info">Company/Business Name Updated. </div>';
		
				
			}
			
		
		
		}
	
	}

?>






<?php
if (isset($_POST['process1'])) {
    $comp_name = mysqli_real_escape_string($connect, $_POST['d_comp_name']);

    // Check if company name already exists
    $check_query = mysqli_query($connect, "SELECT * FROM digi_card WHERE d_comp_name='$comp_name'");
    
    if (!$check_query) {
        echo '<div class="alert danger">Error: ' . mysqli_error($connect) . '</div>';
        exit;
    }

    $count = mysqli_num_rows($check_query);
    $card_id_base = str_replace(array(' ', '.', '&', '/', '', '[', ']'), array('-', '', '', '-', '', '', ''), $comp_name);
    $card_id = $card_id_base . ($count > 0 ? ($count + 1) : '');

    // Insert new card
    $insert = mysqli_query($connect, "INSERT INTO digi_card 
        (d_comp_name, uploaded_date, d_payment_status, user_email, d_card_status, card_id, f_user_email)
        VALUES ('$comp_name', '$date', 'Created', '{$_SESSION['user_email']}', 'Active', '$card_id', '$franchisee_email')");

    if ($insert) {
        // Get the latest inserted card
        $latest_card_query = mysqli_query($connect, "SELECT * FROM digi_card WHERE d_comp_name='$comp_name' AND user_email='{$_SESSION['user_email']}' ORDER BY id DESC LIMIT 1");
        
        if ($latest_card_query && mysqli_num_rows($latest_card_query) > 0) {
            $row = mysqli_fetch_array($latest_card_query);
            $_SESSION['card_id_inprocess'] = $row['id'];

            // Insert into digi_card2 and digi_card3
            mysqli_query($connect, "INSERT INTO digi_card2 (id, user_email, card_id) VALUES ('{$row['id']}', '{$_SESSION['user_email']}', '$card_id')");
            mysqli_query($connect, "INSERT INTO digi_card3 (id, user_email, card_id) VALUES ('{$row['id']}', '{$_SESSION['user_email']}', '$card_id')");

            echo '<a href="select_theme.php"><div class="alert success">Company Name Added. CARD Number is: ' . $row['id'] . '<br>Wait... For next page.</div></a>';
            echo '<style>form {display:none;}</style>';
            echo '<meta http-equiv="refresh" content="0;URL=select_theme.php">';
            exit;
        } else {
            echo '<div class="alert danger">Unable to fetch inserted card details.</div>';
        }
    } else {
        echo '<div class="alert danger">Insert failed: ' . mysqli_error($connect) . '</div>';
    }
}
?>


</div>




<footer class="">

<p>© <?php echo $_SERVER['HTTP_HOST']; ?> || 2020</p>

</footer>