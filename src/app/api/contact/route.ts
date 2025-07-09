import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Configure SendGrid avec la clé API (SMTP_PASSWORD)
sgMail.setApiKey(process.env.SMTP_PASSWORD!)

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validation des données
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Configuration de l'email
    const msg = {
      to: process.env.CONTACT_EMAIL || 'contact@humblebabs.com', // Email de réception
      from: process.env.SMTP_FROM || 'contact@humblebabs.com', // Email d'envoi
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #23235b;">Nouveau message de contact</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Détails du contact</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px; font-size: 12px; color: #666;">
            <p>Ce message a été envoyé depuis le formulaire de contact de humblebabs.com</p>
            <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      `,
      text: `
Nouveau message de contact

Nom: ${name}
Email: ${email}
Sujet: ${subject}

Message:
${message}

---
Envoyé depuis humblebabs.com
Date: ${new Date().toLocaleString('fr-FR')}
      `
    }

    // Envoi de l'email
    await sgMail.send(msg)

    return NextResponse.json(
      { message: 'Email envoyé avec succès' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.' },
      { status: 500 }
    )
  }
} 