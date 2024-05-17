package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"golang.org/x/image/tiff"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"mime/multipart"
	"net/http"
	"net/smtp"
	_ "net/smtp"
	"os"
)

var imgBytesCopy []byte

// Initialize function to register TIFF format for decoding
func init() {
	image.RegisterFormat("tiff", "tiff", tiff.Decode, tiff.DecodeConfig)
}

func emailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// Retrieve form values
		email := r.FormValue("email")
		filename := r.FormValue("fileName")

		// Send the image as an email attachment
		// Save the image to a file
		filename = filename + ".png"
		err := os.WriteFile(filename, imgBytesCopy, 0644)
		if err != nil {
			http.Error(w, "Error saving image", http.StatusInternalServerError)
			return
		}
		err = sendMail(email, "Here is your image", "Please find the attached image.", imgBytesCopy)
		if err != nil {
			http.Error(w, "Error sending email", http.StatusInternalServerError)
			return
		}

		// If everything goes well, return a success response
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Email sent successfully"))
	}
}

// Handler function to handle incoming HTTP requests
func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// Retrieve form values
		position := r.FormValue("position")
		file, _, err := r.FormFile("photo")
		if err != nil {
			http.Error(w, "Error obtaining file", http.StatusBadRequest)
			return
		}
		defer file.Close()
		fontPath := r.FormValue("fontName")
		text := r.FormValue("text")
		text2 := r.FormValue("text2")

		// Call function to handle received data
		imgBytes, err := drawWithGolangFont(file, fontPath, text, text2, position)
		if err != nil {
			http.Error(w, "Error processing data", http.StatusInternalServerError)
			return
		}
		imgBytesCopy = imgBytes
		// Send processed image as response
		w.Header().Set("Content-Type", "image/png")
		w.Write(imgBytes)
	}
}

// Function to send email with attached image
func sendMail(to, subject, body string, img []byte) error {
	from := "leinerlenguajes@gmail.com"
	pass := "dphu xdcw rrkc wxrv"

	// Construct email message
	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + subject + "\n" +
		"MIME-Version: 1.0\n" +
		"Content-Type: multipart/mixed; boundary=\"foo_bar_baz\"\n" +
		"\n--foo_bar_baz\n" +
		"Content-Type: text/plain; charset=\"UTF-8\"\n" +
		"\n" + body + "\n" +
		"--foo_bar_baz\n" +
		"Content-Type: image/png; name=\"image.png\"\n" +
		"Content-Transfer-Encoding: base64\n" +
		"Content-Disposition: attachment; filename=\"image.png\"\n" +
		"\n" + base64.StdEncoding.EncodeToString(img) + "\n" +
		"--foo_bar_baz--"

	// Send email via SMTP
	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		return err
	}

	return nil
}

// Function to draw text on image using Golang font
func drawWithGolangFont(imgFile multipart.File, fontName, text, text2, textPosition string) ([]byte, error) {
	lineSpacing := 1.5
	defer imgFile.Close()
	alignment := 1

	img, _, err := image.Decode(imgFile)
	if err != nil {
		return nil, err
	}

	// Get width and height of the original image
	width := float64(img.Bounds().Dx())
	height := float64(img.Bounds().Dy())
	fontSize := width * 0.08

	dc := gg.NewContextForImage(img)
	fontPath := fmt.Sprintf("Fonts/%s.ttf", fontName)
	// Load font from file
	fontBytes, err := os.ReadFile(fontPath)
	if err != nil {
		return nil, err
	}
	font, err := truetype.Parse(fontBytes)
	if err != nil {
		return nil, err
	}

	face := truetype.NewFace(font, &truetype.Options{
		Size: fontSize,
	})
	dc.SetFontFace(face)
	dc.SetRGB(0, 0, 0) // Text color

	// Determine text position
	var y float64
	if textPosition == "Top" {
		y = 0
		dc.DrawStringWrapped(
			text,
			0, y,
			0, 0,
			width, lineSpacing,
			gg.Align(alignment))
	} else if textPosition == "Bottom" {
		y = height - 80
		dc.DrawStringWrapped(
			text,
			0, y,
			0, 0,
			width, lineSpacing,
			gg.Align(alignment))
	} else if textPosition == "Top and Bottom" {
		// Text at the top
		y = 0
		dc.DrawStringWrapped(
			text,
			0, y,
			0, 0,
			width, lineSpacing,
			gg.Align(alignment))
		// Text at the bottom
		y = height - 80
		dc.DrawStringWrapped(
			text2,
			0, y,
			0, 0,
			width, lineSpacing,
			gg.Align(alignment))
	}
	buf := new(bytes.Buffer)
	err = dc.EncodePNG(buf)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// Function to handle OPTIONS requests
func handleOptions(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4321")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.WriteHeader(http.StatusOK)

	handler(w, r)

}
func handleOptionsEmail(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4321")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.WriteHeader(http.StatusOK)

	emailHandler(w, r)

}

func main() {
	// Handle all OPTIONS requests globally
	http.HandleFunc("/", handleOptions)           // Handle all requests to the root with the handler function
	http.HandleFunc("/email", handleOptionsEmail) // Handle all requests to the root with the handler function
	fmt.Println("Server listening on port 8080...")
	http.ListenAndServe(":8080", nil)
	// Start the server on port 8080

}
