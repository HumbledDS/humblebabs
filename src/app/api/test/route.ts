import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Test de lecture d'un fichier Markdown
    const filePath = join(process.cwd(), 'CoursDataEngineer_Markdown_Final', '01-fondamentaux-data-engineering.md')
    const content = readFileSync(filePath, 'utf-8')
    
    // Extraire les premiers caractères pour vérifier
    const preview = content.substring(0, 500)
    
    return NextResponse.json({
      success: true,
      message: 'Fichier Markdown lu avec succès',
      preview: preview,
      totalLength: content.length
    })
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la lecture du fichier',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
