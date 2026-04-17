import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let formData: FormData | null = null
  try {
    formData = await request.formData()

    // Extract form fields
    const campId = formData.get('campId') as string
    const email = formData.get('email') as string
    const childName = formData.get('childName') as string
    const nickName = formData.get('nickName') as string | null
    const gender = formData.get('gender') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const ageGroup = formData.get('ageGroup') as string
    const currentSchool = formData.get('currentSchool') as string | null
    const nationalityLanguage = formData.get('nationalityLanguage') as string | null
    const englishLevel = formData.get('englishLevel') as string | null

    // Parents
    const parentName1 = formData.get('parentName1') as string
    const parentName2 = formData.get('parentName2') as string | null
    const mobilePhone1 = formData.get('mobilePhone1') as string
    const mobilePhone2 = formData.get('mobilePhone2') as string | null
    const wechatWhatsapp1 = formData.get('wechatWhatsapp1') as string | null
    const wechatWhatsapp2 = formData.get('wechatWhatsapp2') as string | null
    const emergencyContactName = formData.get('emergencyContactName') as string
    const emergencyContactPhone = formData.get('emergencyContactPhone') as string

    // Health
    const allergies = formData.get('allergies') as string
    const healthBehavioralConditions = formData.get('healthBehavioralConditions') as string
    const hasInsurance = formData.get('hasInsurance') === 'true'
    const behavioralDeclaration = formData.get('behavioralDeclaration') === 'true'

    // Weeks and permissions
    const weeksSelected = JSON.parse(formData.get('weeksSelected') as string)
    const photoPermission = formData.get('photoPermission') === 'true'
    const howDidYouFind = formData.get('howDidYouFind') as string
    const termsAcknowledged = formData.get('termsAcknowledged') === 'true'
    const allStatementsTrue = formData.get('allStatementsTrue') === 'true'

    // Traffic source attribution
    const utmSource = formData.get('utmSource') as string | null
    const utmMedium = formData.get('utmMedium') as string | null
    const utmCampaign = formData.get('utmCampaign') as string | null
    const utmContent = formData.get('utmContent') as string | null
    const utmTerm = formData.get('utmTerm') as string | null
    const referrer = formData.get('referrer') as string | null
    const landingPage = formData.get('landingPage') as string | null

    // Files
    const childPassport = formData.get('childPassport') as File | null
    const parentPassport1 = formData.get('parentPassport1') as File | null
    const parentPassport2 = formData.get('parentPassport2') as File | null

    const supabase = await createClient()

    // Upload files to Supabase Storage
    const uploadFile = async (file: File | null, path: string) => {
      if (!file) return null

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${path}/${fileName}`

      const { data, error } = await supabase.storage
        .from('registration-documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        console.error('File upload error:', error)
        throw new Error(`Failed to upload file: ${error.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('registration-documents')
        .getPublicUrl(filePath)

      return publicUrl
    }

    // Create folder path with email (sanitized)
    const emailFolder = email.replace(/[^a-zA-Z0-9]/g, '_')
    const uploadPath = `${campId}/${emailFolder}`

    // Upload all files
    const childPassportUrl = await uploadFile(childPassport, uploadPath)
    const parentPassport1Url = await uploadFile(parentPassport1, uploadPath)
    const parentPassport2Url = await uploadFile(parentPassport2, uploadPath)

    // Insert registration into database
    const { data: registration, error: dbError } = await supabase
      .from('registrations')
      .insert({
        camp_id: campId,
        email,
        child_name: childName,
        nick_name: nickName,
        gender,
        date_of_birth: dateOfBirth,
        age_group: ageGroup,
        current_school: currentSchool,
        nationality_language: nationalityLanguage,
        english_level: englishLevel,
        parent_name_1: parentName1,
        parent_name_2: parentName2,
        mobile_phone_1: mobilePhone1,
        mobile_phone_2: mobilePhone2,
        wechat_whatsapp_1: wechatWhatsapp1,
        wechat_whatsapp_2: wechatWhatsapp2,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
        allergies,
        health_behavioral_conditions: healthBehavioralConditions,
        has_insurance: hasInsurance,
        behavioral_declaration: behavioralDeclaration,
        child_passport_url: childPassportUrl,
        parent_passport_1_url: parentPassport1Url,
        parent_passport_2_url: parentPassport2Url,
        weeks_selected: weeksSelected,
        photo_permission: photoPermission,
        how_did_you_find: howDidYouFind,
        terms_acknowledged: termsAcknowledged,
        all_statements_true: allStatementsTrue,
        payment_status: 'pending',
        // Traffic source attribution
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        referrer: referrer,
        landing_page: landingPage
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save registration', details: dbError.message },
        { status: 500 }
      )
    }

    // Telegram notification handled by Supabase database trigger (edge function)

    return NextResponse.json({
      success: true,
      registration: registration
    })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    const errStack = error instanceof Error ? error.stack?.split('\n').slice(0, 3).join(' | ') : ''
    console.error('Registration API error:', errMsg, errStack)

    // Dump full form data + error to Telegram so we can register manually if needed
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const chatId = process.env.TELEGRAM_TASKS_GROUP_ID || '-4990540528'
      if (botToken) {
        // Extract all form fields for manual recovery
        const fields: Record<string, string> = {}
        if (formData?.forEach) {
          formData.forEach((value, key) => {
            if (value instanceof File) {
              fields[key] = `[File: ${value.name}, ${value.type}, ${(value.size / 1024).toFixed(1)}KB]`
            } else {
              fields[key] = String(value).slice(0, 200)
            }
          })
        }
        const formDump = Object.entries(fields)
          .map(([k, v]) => `  ${k}: ${v}`)
          .join('\n')

        const text = `⚠️ Registration FAILED\n\nChild: ${fields.childName || 'unknown'}\nEmail: ${fields.email || 'unknown'}\nCamp: ${fields.campId || 'unknown'}\nWeeks: ${fields.weeksSelected || '?'}\nProgram: ${fields.ageGroup || '?'}\n\nError: ${errMsg}\n${errStack}\n\n📋 Full form data:\n${formDump}`
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text })
        }).catch(() => {}) // don't let Telegram failure mask the original error
      }
    } catch {} // silent — notification is best-effort

    return NextResponse.json(
      {
        error: 'Registration failed',
        details: errMsg
      },
      { status: 500 }
    )
  }
}
