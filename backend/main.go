package main

import (
	"fmt"
	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"golang.org/x/image/tiff"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"os"
)

func init() {
	image.RegisterFormat("tiff", "tiff", tiff.Decode, tiff.DecodeConfig)
}

func dibujarConFuenteDeGolang(imagenRuta string, fuenteRuta string, tamañoFuente float64, espaciadoDeLineas float64, texto string, alineacion int, posicionTexto string) error {
	imgFile, err := os.Open(imagenRuta)
	if err != nil {
		return err
	}
	defer imgFile.Close()

	img, _, err := image.Decode(imgFile)
	if err != nil {
		return err
	}

	// Obtener el ancho y alto de la imagen original
	ancho := float64(img.Bounds().Dx())
	alto := float64(img.Bounds().Dy())

	dc := gg.NewContextForImage(img)

	// Cargar la fuente desde el archivo
	fuenteBytes, err := os.ReadFile(fuenteRuta)
	if err != nil {
		return err
	}
	fuente, err := truetype.Parse(fuenteBytes)
	if err != nil {
		return err
	}

	face := truetype.NewFace(fuente, &truetype.Options{
		Size: tamañoFuente,
	})
	dc.SetFontFace(face)
	dc.SetRGB(0, 0, 0) // Color del texto

	// Determinar la posición del texto
	var y float64
	if posicionTexto == "Arriba" {
		y = 0
	} else if posicionTexto == "Abajo" {
		y = alto - 100
	} else {
		return fmt.Errorf("posicionTexto debe ser 'arriba' o 'abajo'")
	}

	dc.DrawStringWrapped(
		texto,
		0, y,
		0, 0,
		ancho, espaciadoDeLineas,
		gg.Align(alineacion))
	return dc.SavePNG(fmt.Sprintf("Go.%vx%v, tamaño %v, espacio %v.png", ancho, alto, tamañoFuente, espaciadoDeLineas))
}

func main() {
	texto := "Sinpe al 63715086  aaaaaaaaaaaaaaaaaaaaaa"
	tamañoFuente := 30.00
	alineacion := 1 //0 izquierda, 1 centro, 2 derecha
	err := dibujarConFuenteDeGolang("d4TIFF.tiff", "Fuentes/Courier_New.ttf", tamañoFuente, 1.5, texto, alineacion, "Abajo")
	if err != nil {
		fmt.Println(err)
		return
	}
}
