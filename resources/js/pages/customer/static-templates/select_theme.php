<!DOCTYPE html> 
 <?php

require('connect.php');
require('header.php');

?>


<div class="main3">
<?php

	if(isset($_GET['card_number'])){
		$_SESSION['card_id_inprocess']=$_GET['card_number'];
	}else {
		
	}



$query=mysqli_query($connect,'SELECT * FROM digi_card WHERE id="'.$_SESSION['card_id_inprocess'].'" AND user_email="'.$_SESSION['user_email'].'"');

if(mysqli_num_rows($query)==0){
	echo '<meta http-equiv="refresh" content="2;URL=index.php">';
	echo '<div class="alert danger">Card id does not match with your email account</div>';
}else {
	$row=mysqli_fetch_array($query);
}

?>

	<div class="btn_holder">
		<a href="create_card.php"><div class="back_btn"><i class="fa fa-chevron-circle-left"></i> Back</div></a>
		<a href="create_card2.php"><div class="skip_btn">Skip <i class="fa fa-chevron-circle-right"></i></div></a>
	</div>
	<h1>Select Theme for your card.</h1>
	<center>
	 	<div class="theme"><?php if($row['d_css']=='card_css8.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css30.css"><img src="../login/images/template29.png"></a>
	</div>	
	<div class="theme"><?php if($row['d_css']=='card_css9.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css29.css"><img src="../login/images/template30.png"></a>
	</div>	
	<div class="theme"><?php if($row['d_css']=='card_css10.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css28.css"><img src="../login/images/template1.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css11.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css27.css"><img src="../login/images/template2.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css12.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css26.css"><img src="../login/images/template3.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css13.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css25.css"><img src="../login/images/template4.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css14.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css24.css"><img src="../login/images/template5.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css15.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css23.css"><img src="../login/images/template6.png"></a>
	</div>	
	<div class="theme "><?php if($row['d_css']=='card_css1.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css22.css"><img src="../login/images/template7.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css2.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css21.css"><img src="../login/images/template8.png"></a>
	</div>
	
	<div class="theme"><?php if($row['d_css']=='card_css3.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css20.css"><img src="../login/images/template9.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css4.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css19.css"><img src="../login/images/template10.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css5.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css18.css"><img src="../login/images/template11.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css6.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css17.css"><img src="../login/images/template12.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css7.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css16.css"><img src="../login/images/template13.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css8.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css8.css"><img src="../login/images/template14.png"></a>
	</div>	
	<div class="theme"><?php if($row['d_css']=='card_css9.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css9.css"><img src="../login/images/template15.png"></a>
	</div>	
	<div class="theme"><?php if($row['d_css']=='card_css10.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css10.css"><img src="../login/images/template16.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css11.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css11.css"><img src="../login/images/template17.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css12.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css12.css"><img src="../login/images/template18.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css13.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css13.css"><img src="../login/images/template19.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css14.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css14.css"><img src="../login/images/template20.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css15.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css15.css"><img src="../login/images/template21.png"></a>
	</div>	
	<div class="theme "><?php if($row['d_css']=='card_css1.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css1.css"><img src="../login/images/template22.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css2.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css2.css"><img src="../login/images/template23.png"></a>
	</div>
	
	<div class="theme"><?php if($row['d_css']=='card_css3.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css3.css"><img src="../login/images/template24.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css4.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css4.css"><img src="../login/images/template25.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css5.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css5.css"><img src="../login/images/template26.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css6.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css6.css"><img src="../login/images/template27.png"></a>
	</div>
	<div class="theme"><?php if($row['d_css']=='card_css7.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css7.css"><img src="../login/images/template28.png"></a>
	</div>
		<div class="theme"><?php if($row['d_css']=='card_css31.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css31.css"><img src="../login/images/template31.png"></a>
	</div>
		<div class="theme"><?php if($row['d_css']=='card_css32.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css32.css"><img src="../login/images/template32.png"></a>
		</div>
		
		<div class="theme"><?php if($row['d_css']=='card_css33.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css33.css"><img src="../login/images/template33.png"></a>
		</div>
	<div class="theme"><?php if($row['d_css']=='card_css34.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css34.css"><img src="../login/images/template34.png"></a>
		</div>
		<div class="theme"><?php if($row['d_css']=='card_css35.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css35.css"><img src="../login/images/template35.png"></a>
		</div>
		<div class="theme"><?php if($row['d_css']=='card_css36.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css36.css"><img src=" "></a>
		</div>
		<div class="theme"><?php if($row['d_css']=='card_css37.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css37.css"><img src="../login/images/pre37.webp "></a>
		</div>
		
		<div class="theme"><?php if($row['d_css']=='card_css38.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css38.css"><img src=" ../login/images/pre38.webp"></a>
		</div>
		
		
		<div class="theme"><?php if($row['d_css']=='card_css39.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css39.css"><img src=" ../login/images/pre39.webp"></a>
		</div>
		
		
		<div class="theme"><?php if($row['d_css']=='card_css40.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css40.css"><img src="../login/images/pre40.webp "></a>
		</div>
		
			
		<div class="theme"><?php if($row['d_css']=='card_css41.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css41.css"><img src=" ../login/images/pre41.webp"></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css42.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css42.css"><img src="../login/images/pre42.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css43.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css43.css"><img src=" ../login/images/pre43.webp"></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css44.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css44.css"><img src=" ../login/images/pre44.webp"></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css45.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css45.css"><img src="../login/images/pre45.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css46.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css46.css"><img src="../login/images/pre46.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css47.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css47.css"><img src="../login/images/pre47.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css48.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css48.css"><img src="../login/images/pre48.webp "></a>
		</div>
		
			
		<div class="theme"><?php if($row['d_css']=='card_css49.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css49.css"><img src="../login/images/pre49.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css50.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css50.css"><img src="../login/images/pre50.webp "></a>
		</div>
		
			
		<div class="theme"><?php if($row['d_css']=='card_css51.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css51.css"><img src="../login/images/pre51.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css52.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css52.css"><img src="../login/images/pre52.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css53.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css53.css"><img src="../login/images/pre53.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css54.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css54.css"><img src=" ../login/images/pre54.webp"></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css55.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css55.css"><img src=" ../login/images/pre55.webp"></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css56.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css56.css"><img src=" ../login/images/pre56.webp"></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css57.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css57.css"><img src="../login/images/pre57.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css58.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css58.css"><img src="../login/images/pre58.webp "></a>
		</div>
		
			
		<div class="theme"><?php if($row['d_css']=='card_css59.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css59.css"><img src=" ../login/images/pre59.webp"></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css60.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css60.css"><img src="../login/images/pre60.webp "></a>
		</div>
		
		
				
		<div class="theme"><?php if($row['d_css']=='card_css61.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css61.css"><img src=" ../login/images/pre61.webp"></a>
		</div>
	
	
				
		<div class="theme"><?php if($row['d_css']=='card_css62.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css62.css"><img src="../login/images/pre62.webp "></a>
		</div>
	
				
		<div class="theme"><?php if($row['d_css']=='card_css63.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css63.css"><img src="../login/images/pre63.webp "></a>
		</div>
	
				
		<div class="theme"><?php if($row['d_css']=='card_css64.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css64.css"><img src=" ../login/images/pre64.webp"></a>
		</div>
	
	
				
		<div class="theme"><?php if($row['d_css']=='card_css65.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css65.css"><img src="../login/images/pre65.webp "></a>
		</div>
	
				
		<div class="theme"><?php if($row['d_css']=='card_css66.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css66.css"><img src="../login/images/pre66.webp "></a>
		</div>
	
				
		<div class="theme"><?php if($row['d_css']=='card_css67.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css67.css"><img src="../login/images/pre67.webp "></a>
		</div>
	
				
		<div class="theme"><?php if($row['d_css']=='card_css68.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css68.css"><img src=" ../login/images/pre68.webp"></a>
		</div>
	
				
		<div class="theme"><?php if($row['d_css']=='card_css69.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css69.css"><img src=" ../login/images/pre69.webp"></a>
		</div>
	
				
		<div class="theme"><?php if($row['d_css']=='card_css70.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css70.css"><img src="../login/images/pre70.webp "></a>
		</div>
	
	
				
		<div class="theme"><?php if($row['d_css']=='card_css71.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css71.css"><img src=" ../login/images/pre71.webp"></a>
		</div>
	
				
		<div class="theme"><?php if($row['d_css']=='card_css72.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css72.css"><img src="../login/images/pre72.webp "></a>
		</div>
	
			
		<div class="theme"><?php if($row['d_css']=='card_css73.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css73.css"><img src="../login/images/pre73.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css74.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css74.css"><img src="../login/images/pre74.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css75.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css75.css"><img src="../login/images/pre75.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css76.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css76.css"><img src="../login/images/pre76.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css77.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css77.css"><img src="../login/images/pre77.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css78.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css78.css"><img src=" ../login/images/pre78.webp"></a>
		</div>
	
			
		<div class="theme"><?php if($row['d_css']=='card_css79.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css79.css"><img src="../login/images/pre79.webp "></a>
		</div>
			
		<div class="theme"><?php if($row['d_css']=='card_css80.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css80.css"><img src=" ../login/images/pre80.webp"></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css81.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css81.css"><img src="../login/images/pre81.webp "></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css82.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css82.css"><img src="../login/images/pre82.webp "></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css83.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css83.css"><img src="../login/images/pre83.webp "></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css84.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css84.css"><img src="../login/images/pre84.webp "></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css85.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css85.css"><img src="../login/images/pre85.webp "></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css86.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css86.css"><img src="../login/images/pre86.webp "></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css87.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css87.css"><img src=" ../login/images/pre87.webp"></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css88.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css88.css"><img src="../login/images/pre88.webp "></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css89.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css89.css"><img src="../login/images/pre89.webp "></a>
		</div>
	
		
		<div class="theme"><?php if($row['d_css']=='card_css90.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css90.css"><img src=" ../login/images/pre90.webp"></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css91.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css91.css"><img src="../login/images/pre91.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css92.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css92.css"><img src="../login/images/pre92.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css93.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css93.css"><img src="../login/images/pre93.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css94.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css94.css"><img src="../login/images/pre94.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css95.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css95.css"><img src="../login/images/pre95.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css96.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css96.css"><img src="../login/images/pre96.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css97.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css97.css"><img src="../login/images/pre97.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css98.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css98.css"><img src="../login/images/pre98.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css99.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css99.css"><img src="../login/images/pre99.webp "></a>
		</div>
	
	
		<div class="theme"><?php if($row['d_css']=='card_css100.css'){echo '<div class="selected">Selected</div>';} ?>
		<a href="select_theme.php?d_css=card_css100.css"><img src="../login/images/pre100.webp "></a>
		</div>
	
	
	
	
	
	</center>




<?php
if(isset($_GET['d_css'])){
				
$query=mysqli_query($connect,'SELECT * FROM digi_card WHERE id="'.$_SESSION['card_id_inprocess'].'"');
		if(mysqli_num_rows($query)==1){
			
		// enter details in database
			
			$update=mysqli_query($connect,'UPDATE digi_card SET 
			
			d_css="'.$_GET['d_css'].'"
			
			WHERE id="'.$_SESSION['card_id_inprocess'].'"');
			
		// enter details in database ending
		
		if($update){
			echo '<a href="create_card2.php"><input type="submit" class="" name="process2" value="Next 3" id="block_loader">';
			echo '<div class="alert info">Theme Saved. Wait...</div></a>';
			echo '<meta http-equiv="refresh" content="1;URL=create_card2.php">';
		}else {
			echo '<a href="select_theme.php"><div class="alert danger">Error! Try Again.</div></a>';
		}
				
		}
	}else {
		
		
	}
	

?>

</div>




<footer class="">

<p>© <?php echo $_SERVER['HTTP_HOST']; ?> || 2021</p>

</footer>