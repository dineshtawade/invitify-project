<?php

require('connect.php');

?>


 <?php

if(!isset($_SESSION['user_email'])){echo '<meta http-equiv="refresh" content="0;URL=login.php">';}
?>

<?php
$query=mysqli_query($connect,'SELECT * FROM digi_card WHERE id="'.$_SESSION['card_id_inprocess'].'" AND user_email="'.$_SESSION['user_email'].'"');

if(mysqli_num_rows($query)==0){
	echo '<meta http-equiv="refresh" content="0;URL=index.php">';
}else {
	$row=mysqli_fetch_array($query);
	
}

// auto download contact



?>
<link rel="stylesheet" href="<?php if(!empty($row['d_css'])){echo '../'.$row['d_css'];}else {echo '../card_css1.css';} ?>" >
 <link rel="stylesheet" href="https://unpkg.com/flickity@2/dist/flickity.min.css">
          <link rel="stylesheet" href="../../panel/feedback.css" >



<script>

$(document).ready(function(){
	$('.mobile_home').on('click',function(){
		$('#header').toggleClass('add_height');
		
	})
})

</script>

<!----------------------copy from here ------------------------->

<?php
if (isset($_POST['choose_plan']) && isset($_POST['plan_id'])) {
    $plan_id = intval($_POST['plan_id']);
    $plan = mysqli_fetch_assoc(mysqli_query($connect, "SELECT * FROM subscriptions WHERE id=$plan_id"));
    if ($plan) {
        header("Location: payment_page/pay.php?id=" . $row['id'] . "&plan_id=" . $plan_id);
        exit;
    }
}
?>

<?php
if($row['d_payment_status']=='Created'){echo '<div class="card_status1"><p>Trial</p></div>';
?>
<div class="save_contact_popup">
	<div class="close" id="close_save_pop">&times;</div>
	<p> Hi <?php if(!empty($row['d_f_name'])){echo $row['d_f_name'].' '.$row['d_l_name'];}else {echo 'Customer.';} ?></p>
	<p>Your card has been created.</p>
	<p>Pay now to activate your card.</p>
	<button><a href="../login/"> Back to Dashboard</a></button>
	
	
	
	
	<div class="btn_save" id="activateBtn">Activate Now</div>
</div>


<?php

}else if($row['d_payment_status']=='Success'){echo '<div class="card_status2"><p>Active</p></div>';}else if($row['d_payment_status']=='Failed'){echo '<div class="card_status3"><p>Inactive</p></div>';}

?>

<!-- Plan Selection Modal -->
<style>
#planModal.modal {
  display: none;
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.45);
  align-items: center; justify-content: center;
  z-index: 9999;
}
#planModal .modal-content {
  background: #fff;
  padding: 32px 28px 24px 28px;
  border-radius: 14px;
  min-width: 320px;
  max-width: 95vw;
  margin: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  animation: popin 0.25s cubic-bezier(.4,2,.6,1) 1;
}
@keyframes popin {
  0% { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
#planModal .close {
  position: absolute;
  top: 10px; right: 16px;
  font-size: 28px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
#planModal .close:hover { color: #e74c3c; }
#planModal h3 {
  margin-top: 0;
  font-size: 1.3rem;
  color: #222;
  text-align: center;
  margin-bottom: 18px;
}
#planModal form label {
  display: flex;
  align-items: center;
  background: #f7f7fa;
  border-radius: 7px;
  padding: 10px 14px;
  margin-bottom: 10px;
  cursor: pointer;
  border: 1px solid #ececec;
  transition: box-shadow 0.2s, border 0.2s;
}
#planModal form label:hover {
  box-shadow: 0 2px 8px rgba(52,152,219,0.08);
  border: 1.5px solid #3498db;
}
#planModal input[type="radio"] {
  accent-color: #3498db;
  margin-right: 12px;
  width: 18px; height: 18px;
}
#planModal button[type="submit"] {
  width: 100%;
  background: linear-gradient(90deg, #3498db 60%, #6dd5fa 100%);
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(52,152,219,0.08);
  transition: background 0.2s, box-shadow 0.2s;
}
#planModal button[type="submit"]:hover {
  background: linear-gradient(90deg, #217dbb 60%, #3498db 100%);
  box-shadow: 0 4px 16px rgba(52,152,219,0.13);
}
</style>
<div id="planModal" class="modal">
  <div class="modal-content">
    <span class="close" id="closeModal">&times;</span>
    <h3>Select a Plan</h3>
    <form method="POST" id="planForm">
      <?php
      $plans = mysqli_query($connect, "SELECT id, name, price FROM subscriptions");
      while($plan = mysqli_fetch_assoc($plans)): ?>
        <label>
          <input type="radio" name="plan_id" value="<?php echo $plan['id']; ?>" required>
          <?php echo htmlspecialchars($plan['name']) . " (₹" . $plan['price'] . ")"; ?>
        </label>
      <?php endwhile; ?>
      <button type="submit" name="choose_plan">Continue to Payment</button>
    </form>
  </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  var activateBtn = document.getElementById('activateBtn');
  var planModal = document.getElementById('planModal');
  var closeModal = document.getElementById('closeModal');
  if (activateBtn && planModal) {
    activateBtn.onclick = function(e) {
      e.preventDefault();
      planModal.style.display = 'flex';
    };
  }
  if (closeModal && planModal) {
    closeModal.onclick = function() {
      planModal.style.display = 'none';
    };
  }
  window.onclick = function(event) {
    if (event.target == planModal) planModal.style.display = 'none';
  };
});
</script>
<!-----popup for customer login to see page---------------->
	
	
<script>
	$(document).ready(function(){
		$('#close_save_pop').on('click',function(){
			$('.save_contact_popup').slideToggle();
		})
	})

</script>
<!-----popup for customer login to see page---------------->
<!-----Copy from here---------------->
<!----------------------copy from here ------------------------->


	<div class="card" id="home">
			
			<div class="card_content"><img src="<?php if(!empty($row['d_logo'])){echo 'data:image/*;base64,'.base64_encode($row['d_logo']);} ?>" alt="Logo"></div>
			<div class="card_content2">
				<h2><?php if(!empty($row['d_comp_name'])){echo $row['d_comp_name'];} ?></h2>
				<p><?php if(!empty($row['d_f_name'])){echo $row['d_f_name'].' '.$row['d_l_name'];} ?></p>
				<p><?php if(!empty($row['d_position'])){echo $row['d_position'];} ?></p>
				
			</div>
			<div class="dis_flex">
				<?php if(!empty($row['d_contact'])){echo '<a href="tel:+91'.$row['d_contact'].'" target="_blank"><div class="link_btn"><i class="fa fa-phone"></i> Call</div></a>';} ?>
				<?php if(!empty($row['d_whatsapp'])){echo '<a href="https://api.whatsapp.com/send?phone=91'.str_replace('+91','',$row['d_whatsapp']).'&text=Hi, '.$row['d_comp_name'].'" target="_blank"><div class="link_btn"><i class="fa fa-whatsapp"></i> WhatsApp</div></a>';} ?>
				
				
				
				<?php if(!empty($row['d_location'])){echo '<a href="'.$row['d_location'].'" target="_blank"><div class="link_btn"><i class="fa fa-map-marker"></i> Direction</div></a>';} ?>
				<?php if(!empty($row['d_email'])){echo '<a href="Mailto:'.$row['d_email'].'" target="_blank"><div class="link_btn"><i class="fa fa-envelope"></i> Mail</div></a>';} ?>
				<?php if(!empty($row['d_website'])){echo '<a href="https://'.$row['d_website'].'" target="_blank"><div class="link_btn"><i class="fa fa-globe"></i> Website</div></a>';} ?>
			
			</div>
	
			<div class="contact_details">
				<?php if(!empty($row['d_contact'])){echo '<div class="contact_d"><i class="fa fa-phone"></i><p>'.$row['d_contact'].'</p></div>';} ?>
				<?php if(!empty($row['d_contact2'])){echo '<div class="contact_d"><i class="fa fa-phone"></i><p>'.$row['d_contact2'].'</p></div>';} ?>
				<?php if(!empty($row['d_email'])){echo '<div class="contact_d"><i class="fa fa-envelope"></i><p>'.$row['d_email'].'</p></div>';} ?>
				<?php if(!empty($row['d_address'])){echo '<div class="contact_d"><i class="fa fa-map-marker" ></i><p>'.$row['d_address'].'</p></div>';} ?>
				
			</div>
			
			<div class="dis_flex">
				<div class="share_wtsp">
					<form action="https://api.whatsapp.com/send" id="wtsp_form" target="_blank"><input type="text"  name="phone" placeholder="WhatsApp Number with Country code	" value="+91"><input type="hidden" name="text" value="https://<?php echo $_SERVER['HTTP_HOST']; ?>/<?php echo $row['card_id']; ?>"><div class="wtsp_share_btn" onclick="subForm()"><i class="fa fa-whatsapp"></i> Share</div></form>
					
					<script>
					
					$(document).ready(function(){
						$('.wtsp_share_btn').on('click',function(){
							$('#wtsp_form').submit();
						})
						
					})
					</script>
				</div>
			</div>
			
			<div class="dis_flex">
			
			<style type="text/css">
			    
			    .goog-te-gadget-simple,.goog-te-combo {
    background-color: rgba(72, 72, 72, 0.55) !important;
    border-left: rgba(72, 72, 72, 0.55) !important;
    border-top: rgba(72, 72, 72, 0.55) !important;
    border-bottom: rgba(72, 72, 72, 0.55) !important;
    border-right: rgba(72, 72, 72, 0.55) !important;
        width: 145px;
    text-align: center;
	color:#fff;
	height: 35px;
    }
    .goog-te-gadget-simple .goog-te-menu-value {
    color: #fff !important;
}
.goog-te-gadget-simple .goog-te-menu-value span {
    color: #fff !important;
        border: 0px !important;

}
.goog-logo-link {
   display:none !important;
} 

.goog-te-gadget{
   color: transparent !important;
}

	.goog-te-gadget img {
    display: none;
}
.translet {
    margin-left: 6px;
 margin-bottom: 10px;
        margin-left: 0px;
        
}

</style>
			    <div class="translet"  >
<div id="google_translate_element"></div>
<script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
<div id="google_translate_element"></div></div>
			
			<?php if(!empty($row['d_contact'])){echo '<a href="contact_download.php?id='.$row['id'].'"><div class="big_btns">Save to Contacts <i class="fa fa-download"></i></div></a>';} ?>
				
				<div class="big_btns" id="share_box_pop">Share <i class="fa fa-share-alt"></i></div>
			
				<div class="share_box">
				
				
				<div class="close" id="close_sharer">&times;</div>
				<p>Share My Digital Card </p>
						<a href="https://api.whatsapp.com/send?text=https://<?php echo $_SERVER['HTTP_HOST']; ?>/<?php echo $row['card_id']; ?>"><div class="shar_btns"><i class="fa fa-whatsapp" id="whatsapp2"  target="_blank"></i><p>WhatsApp</p></div></a>
					<a href="sms:?body=https://<?php echo $_SERVER['HTTP_HOST']; ?>/<?php echo $row['card_id']; ?>" target="_blank"><div class="shar_btns"><i class="fas fa-comment-dots" ></i><p>SMS</p></div></a>
					
					<a href="https://www.facebook.com/sharer/sharer.php?u=https://<?php echo $_SERVER['HTTP_HOST']; ?>/<?php echo $row['card_id']; ?>" target="_blank"><div class="shar_btns"><i class="fa fa-facebook" ></i><p>Facebook</p></div></a>
					<a href="https://twitter.com/intent/tweet?text=https://<?php echo $_SERVER['HTTP_HOST']; ?>/<?php echo $row['card_id']; ?>" target="_blank"><div class="shar_btns"><i class="fa fa-twitter"></i><p>Twitter</p></div></a>
					<a href="" target="_blank"><div class="shar_btns"><i class="fa fa-instagram"></i><p>Instagram</p></div></a>
					<a href="https://www.linkedin.com/cws/share?url=https://<?php echo $_SERVER['HTTP_HOST']; ?>/<?php echo $row['card_id']; ?>" target="_blank"><div class="shar_btns"><i class="fa fa-linkedin"></i><p>Linkedin</p></div></a>
				</div>
			
				<script>
					$(document).ready(function(){
						$('#close_sharer,#share_box_pop').on('click',function(){
							$('.share_box').slideToggle();
						});
					})
				
				
				</script>
			
			</div>
			<div class="dis_flex">
			
				<?php if(!empty($row['d_fb'])){echo '<a href="'.$row['d_fb'].'" target="_blank"><div class="social_med" ><i class="fa fa-facebook"></i></div></a>';} ?>
				<?php if(!empty($row['d_youtube'])){echo '<a href="'.$row['d_youtube'].'" target="_blank"><div class="social_med"><i class="fa fa-youtube"></i></div></a>';} ?>
				<?php if(!empty($row['d_twitter'])){echo '<a href="'.$row['d_twitter'].'" target="_blank"><div class="social_med"><i class="fa fa-twitter"></i></div></a>';} ?>
				<?php if(!empty($row['d_instagram'])){echo '<a href="'.$row['d_instagram'].'" target="_blank"><div class="social_med"><i class="fa fa-instagram"></i></div></a>';} ?>
				<?php if(!empty($row['d_linkedin'])){echo '<a href="'.$row['d_linkedin'].'" target="_blank"><div class="social_med"><i class="fa fa-linkedin"></i></div></a>';} ?>
				<?php if(!empty($row['d_pinterest'])){echo '<a href="'.$row['d_pinterest'].'" target="_blank"><div class="social_med"><i class="fa fa-pinterest"></i></div></a>';} ?>
			</div>
			
			
			
	
	</div>
	
	<div class="card2" style="display:none;">
	
	<h3>Scan QR Code to download the contact details</h3>
	<img src="https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=https://<?php echo $_SERVER['HTTP_HOST'];?>/<?php echo $row['card_id']; ?>" id="qr_code_d">
	
	</div>
	
	
<!--------------about us --------------------------->	
	
	<div class="card2" id="about_us">
		<h3>About Us</h3>
	<?php if(!empty($row['d_comp_est_date'])){echo '<p>'.$row['d_comp_est_date'].'</p>';} ?>
	<?php if(!empty($row['d_about_us'])){echo '<p>'.$row['d_about_us'].'</p>';} ?>
			
		
	
	</div>
	
<!------------shopping online-------------------------->



<?php 
if(isset($row['id'])){
			
	$query3=mysqli_query($connect,'SELECT * FROM products WHERE id="'.$row['id'].'" ');
	$row3=mysqli_fetch_array($query3);
		}

	if(!empty($row3["pro_name1"]) || !empty($row3["pro_name2"]) || !empty($row3["pro_name3"]) || !empty($row3["pro_name4"]) || !empty($row3["pro_name5"])|| !empty($row3["pro_name6"])|| !empty($row3["pro_name7"])|| !empty($row3["pro_name8"])|| !empty($row3["pro_name9"])|| !empty($row3["pro_name10"])){ ?>
	<div class="card2" id="shop_online">
<h3>Shop Online </h3><h3>From Our Store</h3>
		
		
		<?php 
		for($x=0;$x<=30;$x++){
			if(!empty($row3["pro_name$x"])){
				
				echo '<div class="order_box">';
				
				echo '<img src="data:image/*;base64,'.base64_encode($row3["pro_img$x"]).'" alt="Product">';
				echo '<h2>'.$row3["pro_name$x"].'</h2>';
				echo '<p><del><i class="fa fa-rupee"></i>'.$row3["pro_mrp$x"].' </del></p>';
				echo '<h4>'.$row3["pro_price$x"].' <i class="fa fa-rupee"></i></h4>';
				echo "<a href='https://api.whatsapp.com/send?phone=91".str_replace("+91","",$row['d_whatsapp'])."&text=I am interested in Product: ".$row3["pro_name$x"].", Price: ".$row3["pro_price$x"]."' target='_blank'><div class='btn_buy'>Enquiry</div></a>";
				
				echo '</div>';
			} 
		}
			
		?>
		
		
	</div>
<?php } ?>
	
	
		
	
	
<!--------------youtube videos--------------------------->	

<?php 	if(!empty($row["d_youtube1"]) || !empty($row["d_youtube2"]) || !empty($row["d_youtube3"]) || !empty($row["d_youtube4"]) || !empty($row["d_youtube5"])){ ?>
	<div class="card2" id="youtube_video">
		<h3>Youtube Videos</h3>
		
		
		<?php 
		for($x=0;$x<=10;$x++){
			if(!empty($row["d_youtube$x"])){
				
					
				$array1=array('youtu.be/','watch?v=','&feature=youtu.be');
				$array2=array('www.youtube.com/embed/','embed/','');
				
				$youtubelink=str_replace($array1,$array2,$row["d_youtube$x"]);
			
				echo '<iframe src="'.$youtubelink.'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			} 
		}
			
		?>
		
		
	</div>
<?php } ?>
	
	
		
<!----------product and services ----------------------->		
<?php 
if(isset($row['id'])){
			
	$query2=mysqli_query($connect,'SELECT * FROM digi_card2 WHERE id="'.$row['id'].'" ');
	$row2=mysqli_fetch_array($query2);
		}

	if(!empty($row2["d_pro_img1"]) || !empty($row2["d_pro_img2"]) || !empty($row2["d_pro_img3"]) || !empty($row2["d_pro_img4"]) || !empty($row2["d_pro_img5"]) || !empty($row2["d_pro_img6"])|| !empty($row2["d_pro_img7"])|| !empty($row2["d_pro_img8"])|| !empty($row2["d_pro_img9"])|| !empty($row2["d_pro_img10"])|| !empty($row2["d_pro_img11"])|| !empty($row2["d_pro_img12"])|| !empty($row2["d_pro_img13"])|| !empty($row2["d_pro_img14"])|| !empty($row2["d_pro_img15"])|| !empty($row2["d_pro_img16"])|| !empty($row2["d_pro_img17"])|| !empty($row2["d_pro_img18"])|| !empty($row2["d_pro_img19"])|| !empty($row2["d_pro_img20"])) { ?>
	
	<div class="card2" id="product_services">
		<h3>Products & Services</h3>
		
		
		<?php 
		
		
		for($x=0;$x<=20;$x++){
			if(!empty($row2["d_pro_img$x"])){
			echo '<div class="product_s"><p>'.$row2["d_pro_name$x"].'</p>';
			echo '<img src="data:image/*;base64,'.base64_encode($row2["d_pro_img$x"]).'" alt="Logo">';
				echo '<div class="d_dis"><p>'.$row2["d_pro_nam$x"].'</p>';
			echo "<br><br><a href='https://api.whatsapp.com/send?phone=91".str_replace("+91","",$row['d_whatsapp'])."&text=Enquiry for product: ".$row2["d_pro_name$x"]."' target='_blank'><div class='btn_buy'>Enquiry Now</div></a>";
				echo '</div>';
			echo '</div>';
			 
			} 
			
		}
			
		?>
		
	
	</div>
	
<?php } ?>



		
<!----------image gallery----------------------->		
<?php 
if(isset($row['id'])){
	$query3=mysqli_query($connect,'SELECT * FROM digi_card3 WHERE id="'.$row['id'].'" ');
	$row3=mysqli_fetch_array($query3);
		}
	if(!empty($row3["d_gall_img1"]) || !empty($row["d_gall_img2"]) || !empty($row["d_gall_img3"]) || !empty($row["d_gall_img4"]) || !empty($row["d_gall_img5"]) || !empty($row["d_gall_img6"])|| !empty($row["d_gall_img7"])|| !empty($row["d_gall_img8"])|| !empty($row["d_gall_img9"])|| !empty($row["d_gall_img10"])) { ?>


		<div class="card2" id="gallery">
		<h3>Image Gallery</h3>
		
		
		<?php 
		
		
		for($x=0;$x<=10;$x++){
			if(!empty($row3["d_gall_img$x"])){
			echo '<div class="img_gall">';
			echo '<img src="data:image/*;base64,'.base64_encode($row3["d_gall_img$x"]).'" alt="Gallery Image">';
			echo '</div>';
			} 
		}
			
		?>

		
	</div>

<?php } ?>


		
<!----------payment info----------------------->	
<?php 	if(!empty($row["d_paytm"]) || !empty($row["d_account_no"]) ||!empty($row["d_qr_paytm"]) ||!empty($row["d_qr_phone_pay"]) ||!empty($row["d_qr_google_pay"]) || !empty($row["d_google_pay"]) || !empty($row["d_phone_pay"])|| !empty($row["d_ac_type"])  ){ ?>

	<div class="card2" id="payment">
		<h3>Payment Info</h3>
		
		
		<?php 	if(!empty($row["d_paytm"])){echo '<h2>Paytm</h2><p>'.$row['d_paytm'].'</p>';}	?>
		<?php 	if(!empty($row["d_google_pay"])){echo '<h2>Google Pay</h2><p>'.$row['d_google_pay'].'</p>';}?>
		<?php 	if(!empty($row["d_phone_pay"])){echo '<h2>PhonePe</h2><p>'.$row['d_phone_pay'].'</p>';}	?>
		
		<?php 	if(!empty($row["d_account_no"])){echo '<h3>Bank Account Details</h3>'; } ?>
		
		
		<?php 	if(!empty($row["d_ac_name"])){echo '<h2>Name:</h2><p>'.$row['d_ac_name'].'</p>';}	?>
		<?php 	if(!empty($row["d_account_no"])){echo '<h2>Account Number:</h2><p>'.$row['d_account_no'].'</p>';}?>
		<?php 	if(!empty($row["d_ifsc"])){echo '<h2>IFSC Code:</h2><p>'.$row['d_ifsc'].'</p>';	}?>
		<?php 	if(!empty($row["d_bank_name"])){echo '<h2>BANK Name:</h2><p>'.$row['d_bank_name'].'</p>';}	?>
		
		
		<?php 	if(!empty($row["d_ac_type"])){echo '<h3>GST Number </h3><h2>GST No:</h2><p>'.$row['d_ac_type'].'</p>';	}?>
		
		<?php if(!empty($row["d_qr_paytm"])){echo '<img src="data:image/*;base64,'.base64_encode($row["d_qr_paytm"]).'" alt="Paytm QR">';	}	?>
		<?php if(!empty($row["d_qr_google_pay"])){echo '<img src="data:image/*;base64,'.base64_encode($row["d_qr_google_pay"]).'" alt="Google Pay QR">';	}	?>
		<?php if(!empty($row["d_qr_phone_pay"])){echo '<img src="data:image/*;base64,'.base64_encode($row["d_qr_phone_pay"]).'" alt="PhonePe QR">';	}	?>
		
		
		
	</div>
	<?php } ?>	
<!----------Feedback----------------------->	
<div class="card2" id="feedback">

<h3>Feedback</h3>
<script>

$(':radio').change(function() {
  console.log('New star rating: ' + this.value);
});
</script>
<form id="feedback_form"  method="post">
<p class="select_star"> Select Star</p>
	<div class="rating">
	
	  <label>
		<input type="radio" name="r_star" value="1" required>
		<span class="icon">★</span>
	  </label>
	  <label>
		<input type="radio" name="r_star" value="2" required>
		<span class="icon">★</span>
		<span class="icon">★</span>
	  </label>
	  <label>
		<input type="radio" name="r_star" value="3" required>
		<span class="icon">★</span>
		<span class="icon">★</span>
		<span class="icon">★</span>   
	  </label>
	  <label>
		<input type="radio" name="r_star" value="4" required>
		<span class="icon">★</span>
		<span class="icon">★</span>
		<span class="icon">★</span>
		<span class="icon">★</span>
	  </label>
	  <label>
		<input type="radio" name="r_star"  value="5" required>
		<span class="icon">★</span>
		<span class="icon">★</span>
		<span class="icon">★</span>
		<span class="icon">★</span>
		<span class="icon">★</span>
	  </label>

	</div>
	
	<input type="name" name="r_name" placeholder="Your name" required>
	<input type="email" name="r_email" placeholder="Your email id" >
	
	<input type="number" max="999999999999" min="5555555555" name="r_contact" placeholder="Your contact ">
	<textarea name="r_msg" placeholder="Your feedback "></textarea>
	<input type="submit" name="submit_feedback" value="Submit Feedback"> 

	<p class="note">Note: for privecy and security reasons we do not show your contact details.</p>
</form>

<?php 

if(isset($_POST['submit_feedback'])){
	$feedbackcheck=mysqli_query($connect,'SELECT * FROM feedback WHERE r_contact="'.$_POST['r_contact'].'" AND  r_email="'.$_POST['r_email'].'" AND r_msg="'.$_POST['r_msg'].'" ');
	
	if(mysqli_num_rows($feedbackcheck)>>0){
		echo '<div class="alert info">Feedback already posted</div>';
	}else {
		$_POST['r_name']=str_replace(array(";","<",">"),array("","",""),$_POST['r_name']);
		$_POST['r_contact']=str_replace(array(";","<",">"),array("","",""),$_POST['r_contact']);
		$_POST['r_email']=str_replace(array(";","<",">"),array("","",""),$_POST['r_email']);
		$_POST['r_msg']=str_replace(array(";","<",">"),array("","",""),$_POST['r_msg']);
		
		$insert_feedback=mysqli_query($connect,'INSERT INTO feedback (ip,card_id,r_star,r_name,r_contact,r_email,r_msg,uploaded_date) VALUES ("'.$_SERVER['REMOTE_ADDR'].'","'.$row['id'].'","'.$_POST['r_star'].'","'.$_POST['r_name'].'","'.$_POST['r_contact'].'","'.$_POST['r_email'].'","'.$_POST['r_msg'].'","'.$date.'")');
		
		if($insert_feedback){
			echo '<div class="alert info">Feedback posted.</div>';
		}
	}
		
}


$feedback=mysqli_query($connect,'SELECT * FROM feedback WHERE card_id="'.$row['id'].'"  ORDER BY id DESC LIMIT 10');
	if(mysqli_num_rows($feedback)>>0){
		
		echo '<p class="tag_feed">Latest feedback</p>';
		echo '<div class="feedback_row">';
		while($feed=mysqli_fetch_array($feedback)){
			// fetch all feedbacks 
			echo '<div class="feedback_block">';
			
			for($x=1;$x <= $feed['r_star'];$x++){
				echo '<div class="star">★</div>';
			}
			echo '<div class="star_rate">'.$feed['r_star'].'/5 Rating</div>';
			echo '<p class="feed_back">'.str_replace(array('xnxx','fucker','motherfucker','mother fucker'),array('','','',''),$feed['r_msg']).'</p>';
			echo '<div class="feed_by">By: <i>'.$feed['r_name'].'</i></div>';
			echo '<div class="feed_date">Date: '.date('d/M/Y h:sA',strtotime($feed['uploaded_date'])).'</div>';
			
			echo '</div>';
		}
		echo '</div>';
	}
	
	
?>

</div>
<!----------Feedback end ----------------------->


<style>
.card2 iframe {
    margin: 8px auto;
    position: relative;
    border-radius: 5px;
    width: -webkit-fill-available;
    min-height: 256px;
    background: white;
}

</style>
<div class="card2" id="address" style="text-align:center;">
	<?php if(!empty($rowch['d_location'])){echo '<h3>'.$rowch['d_location'].'</h3>';}else {echo '<h3>Location Address</h3>';}?>

<span style="    font-size: 13px;
    text-align: center;
    color: #3f51b5;">
Showing result: <a href="https://www.google.com/maps/search/<?php if(!empty($row['d_address'])){echo $row['d_address'];} ?>" target="_blank"><?php if(!empty($row['d_address'])){echo $row['d_address'];}else {echo 'india';} ?> <i class="fa fa-external-link"></i></a>
</span>
<br>
<iframe width="100%" height="auto" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=<?php if(!empty($row['d_location'])){echo $row['d_location'];}else {echo $row['d_address'];} ?>&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>

</div>
	
	
<!----------email to  info----------------------->	
	<div class="card2" id="enquery">
		
		<form action="#" method="post">
			<h3>Contact Us</h3>
			
			<input type="" name="c_name" placeholder="Enter Your Name" required>
			<input type="" name="c_contact" maxlength="13"  placeholder="Enter Your Mobile No" required>
			<input type="email" name="c_email"  placeholder="Enter Your Email Address">
			<textarea name="c_msg" placeholder="Enter your Message or Query" required></textarea>
			<input type="submit" Value="Send!" name="email_to_client">
		
		</form>
		
<?php
if(isset($_POST['email_to_client'])){
        	$to = $row['user_email'];
       $subject = "Customer query from ".$_SERVER['HTTP_HOST'];
        
        $message ='
        Name:'.$_POST['c_name'].'
        Contact Number: '.$_POST['c_contact'].'
        Message:'.$_POST['c_msg'];
        
        $headers .= 'From: <'.$_POST['c_email'].'>' . "\r\n";
        $headers .= 'Cc: <'.$_POST['c_email'].'>' . "\r\n";
        
        if(mail($to,$subject,$message,$headers)){
        	echo '<div class="alert success">Thanks! We have received your email.<br> We will get back to you with in 24hrs.</div>';
        }else {
        	echo '<div class="alert danger">Error Email! try again</div>';
        }
}






?>	<br>
		
		
		<a href="index.php"><div class="create_card_btn"> Create Your Card </div></a>
		
		</div>
	<style>
	.create_card_btn {
		         background: linear-gradient(45deg, black, black);
    color: white;
    width: auto;
    padding: 20px;
    border-radius: 2px;
    line-height: 0.8;
    margin: 11px auto;
    font-size: 9px;
    text-align: center;
	}
	
	
	
#svg_down{position: fixed;
    bottom: 0;
    z-index: -1;
    left: 0;}

	
	</style>
	
	
	
	
	
	<br>
	<br>
	<br>
	<br>
	<div class="menu_bottom">
		<div class="menu_container">
			<div class="menu_item" onclick="location.href='#home'"><i class="fa fa-home"></i> Home</div>
			<div class="menu_item" onclick="location.href='#about_us'"><i class="fa fa-briefcase"></i>About Us</div>
			<div class="menu_item" onclick="location.href='#product_services'"><i class="fa fa-ticket"></i>Product & Services</div>
			<div class="menu_item" onclick="location.href='#shop_online'"><i class="fa fa-archive"></i>Shop</div>
			<div class="menu_item" onclick="location.href='#gallery'"><i class="fa fa-image"></i>Gallery</div>
			<div class="menu_item" onclick="location.href='#youtube_video'"><i class="fa fa-video-camera"></i>Youtube Videos</div>
			<div class="menu_item" onclick="location.href='#payment'"><i class="fa fa-money"></i>Payment</div>
			<div class="menu_item" onclick="location.href='#enquery'"><i class="fa fa-comment"></i>Enquery</div>
		</div>
	</div>
