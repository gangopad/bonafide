<?php
// sanitize input data using PHP filter_var().
$first_name = filter_var($_POST["first_name"], FILTER_SANITIZE_STRING);
$email_address = filter_var($_POST["email_address"], FILTER_SANITIZE_EMAIL);
$phone = filter_var($_POST["phone"], FILTER_SANITIZE_EMAIL);
$job = filter_var($_POST["job"], FILTER_SANITIZE_EMAIL);
$terms = filter_var($_POST["terms"], FILTER_SANITIZE_EMAIL);
$subject = "New job application from Viso landing page";

$message = '<html><body>';
$message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
$message .= "<tr style='background: #eee;'><td><strong>Name:</strong> </td><td>" . strip_tags($_POST['first_name']) . "</td></tr>";
$message .= "<tr><td><strong>Email:</strong> </td><td>" . strip_tags($_POST['email_address']) . "</td></tr>";
$message .= "<tr><td><strong>Phone:</strong> </td><td>" . strip_tags($_POST['phone']) . "</td></tr>";
$message .= "<tr><td><strong>Job:</strong> </td><td>" . strip_tags($_POST['job']) . "</td></tr>";
$message .= "<tr><td><strong>Terms:</strong> </td><td>" . strip_tags($_POST['terms']) . "</td></tr>";
$message .= "</table>";
$message .= "</body></html>";

$file_attached = false;
if(isset($_FILES['file_attach'])) // check uploaded file
{
    // get file details we need
    $file_tmp_name    = $_FILES['file_attach']['tmp_name'];
    $file_name        = $_FILES['file_attach']['name'];
    $file_size        = $_FILES['file_attach']['size'];
    $file_type        = $_FILES['file_attach']['type'];
    $file_error       = $_FILES['file_attach']['error'];

    // exit script and output error if we encounter any
    if($file_error>0)
    {
        $mymsg = array(
        1=>"The uploaded file exceeds the upload_max_filesize directive in php.ini",
        2=>"The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form",
        3=>"The uploaded file was only partially uploaded",
        4=>"No file was uploaded",
        6=>"Missing a temporary folder" );
            
        $output = json_encode(array('type'=>'error', 'text' => $mymsg[$file_error]));
        die($output);
    }
        
    // read from the uploaded file & base64_encode content for the mail
    $handle = fopen($file_tmp_name, "r");
    $content = fread($handle, $file_size);
    fclose($handle);
    $encoded_content = chunk_split(base64_encode($content));
    
    // now we know we have the file for attachment, set $file_attached to true
    $file_attached = true;
}

// allow only pdf amd doc files
$allowedExts = array( "pdf", "doc", "docx" );
$extension = end(explode(".", $_FILES['file_attach']['name'] ));
if ( ! ( in_array($extension, $allowedExts ) ) ) {
    echo 'not-pdf';
    exit();
}

// check and limit file upload size to 6 MB
if ( $file_size > 6000000 ) {
    echo 'too-large';
    exit();
}

//continue if we have the file
if ($file_attached) {
    
    // a random hash will be necessary to send mixed content
    $separator = md5(time());

    // carriage return type (RFC)
    $eol = "\r\n";

    // main header (multipart mandatory)
    $headers = "From: Viso <info@fromemail.com>" . $eol;
    $headers .= "MIME-Version: 1.0" . $eol;
    $headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"" . $eol;
    $headers .= "Content-Transfer-Encoding: 7bit" . $eol;
    $headers .= "This is a MIME encoded message." . $eol;

    // message
    $body .= "--" . $separator . $eol;
    $body .= "Content-type:text/html; charset=utf-8\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $message . $eol;

    // attachment
    $body .= "--" . $separator . $eol;
    $body  .= "Content-Type:".$file_type." ";
    $body .= "Content-Type: application/octet-stream; name=\"" . $file_name . "\"" . $eol;
    $body .= "Content-Transfer-Encoding: base64" . $eol;
    $body .= "Content-Disposition: attachment; filename=\"".$file_name."\"". $eol;
    $body .= $encoded_content . $eol;
    $body .= "--" . $separator . "--";

} else {

    $eol = "\r\n";
    $headers = "From: Viso <info@fromemail.com>" . $eol;
    $headers .= "Reply-To: ". strip_tags($email_address) . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
    $body .= $message . $eol;
}

// recipient email address
$to_email = "yourname@domain.com";

// send the mail
$send_mail = mail($to_email, $subject, $body, $headers);

echo "success";
?>