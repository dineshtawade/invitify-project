<?php

require('connect.php');
require('header.php');

?>


<!-----------------ending php 1st script----------------------->

<div class="container"><center>

<?php 
	$query=mysqli_query($connect,'SELECT * FROM digi_card WHERE user_email="'.$_SESSION['user_email'].'"  ORDER BY id DESC LIMIT 100');
	if(mysqli_num_rows($query)>>0){
		
		echo '<form action="">
		<h3> Select Company</h3>
		<select name="select_id">';
		$querys=mysqli_query($connect,'SELECT * FROM digi_card WHERE id="'.$_GET['select_id'].'" ');
	$rows=mysqli_fetch_array($querys);
		if(isset($_GET['select_id'])){echo '<option value="'.$_GET['select_id'].'" style="font-style:italic;">'.$rows['d_comp_name'].' (Selected)</option>';}
			while($row=mysqli_fetch_array($query)){
				echo '<option value="'.$row['id'].'">'.$row['d_comp_name'].'</option>';
			}
			
			echo '</select>
			<input type="submit" value="Submit" name="">
			</form>';
	}
	
?></center>

	<div class="card_row">
	
		<div class="row_contd">ID</div>
		<div class="row_contd">Company Name</div>
		<div class="row_contd">Stars</div>
		<div class="row_contd">Feedback</div>
		<div class="row_contd">Email</div>
		<div class="row_contd">Name</div>
		<div class="row_contd">Contact</div>
		<div class="row_contd">Date</div>
		<div class="row_contd">Del</div>
		
		
		
		
	</div>
	
	<?php
	
	if(isset($_GET['page_no'])){
				
			}else {$_GET['page_no']='1';}

			
			 
			 $limit=200;
			 
			  $start_from=($_GET['page_no']-1)*$limit;
			  
	$query=mysqli_query($connect,'SELECT * FROM feedback WHERE card_id="'.$_GET['select_id'].'"  ORDER BY id DESC LIMIT '.$start_from.','.$limit.'');

		if(mysqli_num_rows($query)>>0){
			while($row=mysqli_fetch_array($query)){
			echo '<li class="card_row2" id="rem'.$row['id'].'">';
			echo '<div class="row_contd">'.$row['id'].'</div>';
			echo '<div class="row_contd">'.$rows['d_comp_name'].'</div></a>';
			echo '<div class="row_contd">'.$row['r_star'].'</div></a>';
			echo '<div class="row_contd" contenteditable="true">'.$row['r_msg'].'</div>';
			echo '<div class="row_contd" >'.$row['r_email'].'</div>';
			echo '<div class="row_contd" >'.$row['r_name'].'</div>';
			echo '<div class="row_contd" >'.$row['r_contact'].'</div>';
			echo '<div class="row_contd">'.date("d-M-Y",strtotime($row['uploaded_date'])).'</div>';
			echo '<div class="row_contd" onclick="deleteFbk('.$row['id'].')"><i class="fa fa-trash"></i> </div>';
		
				
			
			echo '';
			echo '</li>';
			}
		}else {
			echo '<div class="alert info">No Data Available...</div>';
		}
		
		
	?>
	
	

</div>

	<script>
	
							
							// if approved
								function deleteFbk(id){
										console.log(id);
										$('#rem'+id).html("Deleting...").css('color','red');
									
										$.ajax({
											url:'js_request.php',
											method:'POST',
											data:{del_fbk:id},
											dataType:'text',
											success:function(data){
												$('#rem'+id).hide();

											}
											
										});
										
									}
		// if approved
								function hideFbk(id){
										console.log(id);
										$('#eye'+id).html('<i class="fa fa-eye" style="background: skyblue;color: white;" title="Visible"></i> Working...');
									
										$.ajax({
											url:'js_request.php',
											method:'POST',
											data:{hide_fbk:id},
											dataType:'text',
											success:function(data){
												$('#eye'+id).html(data);

											}
											
										});
										
									}
	
	</script>
	
	<!-------------------Pagination-------------------->
		<div class="pagination">
			<?php 



				

				$query2=mysqli_query($connect,'SELECT * FROM digi_card ORDER BY id DESC ');
			
			 $pages=ceil(mysqli_num_rows($query2)/200);

			for($i=1;$i<=$pages;$i++){
				if($_GET['page_no']==$i){
					echo '<a href="?page_no='.$i.'"><div class="page_btn active">'. $i.'</div></a>';
				}else {
					echo '<a href="?page_no='.$i.'"><div class="page_btn">'. $i.'</div></a>';
				}
				
			}


			?>
	</div>

<!-------------------Pagination-------------------->
<footer class="">

<p>2020 || <?php echo $_SERVER['HTTP_HOST']; ?> </p>

</footer>