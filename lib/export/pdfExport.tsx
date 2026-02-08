import ReactPDF from "@react-pdf/renderer";

import type { ApplicationState, PersonalData } from "@/types/application";
import type { LayoutConfig } from "@/types/layoutConfig";
import type { CoverLetter, CoverLetterMeta } from "@/types/coverLetter";
import type { JobPosting } from "@/types/jobPosting";
import { triggerDownload } from "@/lib/export/jsonExport";
import { addPdfMetadata } from "@/lib/export/pdfPostProcess";

const { Document, Page, Text, View, Image, Link, StyleSheet, pdf } = ReactPDF;

// ─── Font Registration & Mapping ───────────────────────────
import "@/lib/export/fonts";
import { getPdfFont } from "@/lib/export/fonts";

function getFont(fontFamily: string) {
  return getPdfFont(fontFamily);
}

// ─── Shared Props ──────────────────────────────────────────
interface CVProps {
  state: ApplicationState;
  layout: LayoutConfig;
}

interface CoverLetterProps {
  personalData: PersonalData;
  coverLetter: CoverLetter;
  coverLetterMeta: CoverLetterMeta | null;
  jobPosting: JobPosting | null;
  layout: LayoutConfig;
}

interface CoverPageProps {
  personalData: PersonalData;
  jobPosting: JobPosting | null;
  layout: LayoutConfig;
}

// ═══════════════════════════════════════════════════════════
//  COVER PAGE (shared across all templates)
// ═══════════════════════════════════════════════════════════

// DIN 5008 margins: left 25mm, right 20mm, top/bottom 20mm
// 1mm ≈ 2.83465 points
const DIN_MARGIN_LEFT = 70.87; // 25mm
const DIN_MARGIN_RIGHT = 56.69; // 20mm
const DIN_MARGIN_TOP = 56.69; // 20mm
const DIN_MARGIN_BOTTOM = 56.69; // 20mm

const coverPageStyles = StyleSheet.create({
  page: {
    paddingLeft: DIN_MARGIN_LEFT,
    paddingRight: DIN_MARGIN_RIGHT,
    paddingTop: DIN_MARGIN_TOP,
    paddingBottom: DIN_MARGIN_BOTTOM,
    fontFamily: "Helvetica",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 120,
    height: 160,
    objectFit: "cover",
    marginBottom: 24,
    border: "1pt solid #ccc",
  },
  title: { fontSize: 36, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 18, color: "#666666", marginBottom: 40 },
  line: { width: 60, height: 2, marginBottom: 40, backgroundColor: "#333333" },
  name: { fontSize: 14, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  detail: {
    fontSize: 12,
    color: "#333333",
    marginBottom: 3,
    textAlign: "center",
    lineHeight: 1.6,
  },
});

function CoverPageSection({ personalData, jobPosting, layout }: CoverPageProps) {
  const font = getFont(layout.fontFamily);
  const fullName = `${personalData.firstName} ${personalData.lastName}`;
  return (
    <Page
      size="A4"
      style={{
        ...coverPageStyles.page,
        fontFamily: font.regular,
        fontSize: layout.fontSize,
      }}
    >
      <View style={coverPageStyles.center}>
        <Text
          style={{
            ...coverPageStyles.title,
            fontFamily: font.bold,
            color: layout.primaryColor,
          }}
        >
          Bewerbung
        </Text>
        {jobPosting?.jobTitle && (
          <Text style={{ ...coverPageStyles.subtitle, color: layout.secondaryColor }}>
            als {jobPosting.jobTitle}
          </Text>
        )}
        {personalData.photo && layout.showPhoto && (
          <Image src={personalData.photo} style={coverPageStyles.photo} />
        )}
        <View
          style={{
            ...coverPageStyles.line,
            backgroundColor: layout.primaryColor,
          }}
        />
        <Text
          style={{ ...coverPageStyles.name, fontFamily: font.bold }}
        >
          {fullName}
        </Text>
        {personalData.address.street && (
          <Text style={coverPageStyles.detail}>
            {personalData.address.street}
          </Text>
        )}
        {(personalData.address.zip || personalData.address.city) && (
          <Text style={coverPageStyles.detail}>
            {personalData.address.zip} {personalData.address.city}
          </Text>
        )}
        {personalData.phone && (
          <Text style={coverPageStyles.detail}>Tel.: {personalData.phone}</Text>
        )}
        {personalData.email && (
          <Text style={coverPageStyles.detail}>E-Mail: {personalData.email}</Text>
        )}
        {jobPosting?.companyName && (
          <Text style={{ ...coverPageStyles.detail, marginTop: 30, fontFamily: font.bold }}>
            bei {jobPosting.companyName}
          </Text>
        )}
        <Text style={{ ...coverPageStyles.detail, marginTop: 30, fontSize: 10 }}>
          Anlagen:{"\n"}Lebenslauf{"\n"}Zeugnisse
        </Text>
      </View>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  COVER LETTER (shared across all templates)
// ═══════════════════════════════════════════════════════════

const clStyles = StyleSheet.create({
  page: {
    paddingLeft: DIN_MARGIN_LEFT,
    paddingRight: DIN_MARGIN_RIGHT,
    paddingTop: DIN_MARGIN_TOP,
    paddingBottom: DIN_MARGIN_BOTTOM,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.4,
  },
  senderHeader: {
    textAlign: "right",
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 14,
    color: "#555555",
  },
  // Adressfeld nach DIN 5008: Position 45mm von oben, 25mm von links
  addressBlock: {
    position: "absolute",
    top: 127.56, // 45mm from top
    left: DIN_MARGIN_LEFT,
    width: 240.95, // 85mm
    height: 113.39, // 40mm
  },
  senderSmall: {
    fontSize: 7,
    textDecoration: "underline",
    marginBottom: 14,
    color: "#333333",
  },
  recipient: { fontSize: 11, lineHeight: 1.4 },
  date: {
    textAlign: "right",
    fontSize: 11,
    marginTop: 170, // Damit es unterhalb des Adressfelds ist
    marginBottom: 56,
  },
  subject: { fontSize: 12, marginBottom: 20, fontFamily: "Helvetica-Bold" },
  body: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 11,
    textAlign: "left",
  },
  signature: { marginTop: 42, fontSize: 11 },
  attachments: { marginTop: 42, fontSize: 10, fontFamily: "Helvetica-Bold" },
});

function CoverLetterSection({
  personalData,
  coverLetter,
  coverLetterMeta,
  jobPosting,
  layout,
}: CoverLetterProps) {
  const font = getFont(layout.fontFamily);
  const fullName = `${personalData.firstName} ${personalData.lastName}`;
  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const letterText = coverLetter.fullText
    ? coverLetter.fullText
    : [coverLetter.introduction, coverLetter.mainBody, coverLetter.closing]
        .filter(Boolean)
        .join("\n\n");

  const subject = jobPosting?.jobTitle
    ? `Bewerbung als ${jobPosting.jobTitle}${jobPosting.referenceNumber ? ` – Referenznummer: ${jobPosting.referenceNumber}` : ""}`
    : "Bewerbung";

  return (
    <Page
      size="A4"
      style={{
        ...clStyles.page,
        fontFamily: font.regular,
        fontSize: layout.fontSize,
        lineHeight: 1.4,
      }}
    >
      {/* Sender in header (top right) - DIN 5008 */}
      <View style={{ ...clStyles.senderHeader, fontFamily: font.regular }}>
        <Text>{fullName}</Text>
        {personalData.address.street && <Text>{personalData.address.street}</Text>}
        {(personalData.address.zip || personalData.address.city) && (
          <Text>
            {personalData.address.zip} {personalData.address.city}
          </Text>
        )}
        {personalData.phone && <Text>Tel.: {personalData.phone}</Text>}
        {personalData.email && <Text>E-Mail: {personalData.email}</Text>}
      </View>

      {/* Address block (for window envelope) - DIN 5008 position */}
      <View style={clStyles.addressBlock}>
        <Text style={clStyles.senderSmall}>
          {fullName} • {personalData.address.street} • {personalData.address.zip}{" "}
          {personalData.address.city}
        </Text>
        {jobPosting && (
          <View style={clStyles.recipient}>
            {jobPosting.companyName && (
              <Text style={{ fontFamily: font.bold }}>
                {jobPosting.companyName}
              </Text>
            )}
            {jobPosting.contactPerson && <Text>{jobPosting.contactPerson}</Text>}
            {jobPosting.companyAddress?.street && (
              <Text>{jobPosting.companyAddress.street}</Text>
            )}
            {(jobPosting.companyAddress?.zip || jobPosting.companyAddress?.city) && (
              <Text style={{ fontFamily: font.bold }}>
                {jobPosting.companyAddress?.zip} {jobPosting.companyAddress?.city}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Date - DIN 5008: right-aligned, below address block */}
      <Text style={{ ...clStyles.date, fontFamily: font.regular }}>
        {personalData.address.city ? `${personalData.address.city}, ` : ""}
        {today}
      </Text>

      {/* Subject - bold, DIN 5008 */}
      <Text style={{ ...clStyles.subject, fontFamily: font.bold, fontSize: layout.fontSize + 1 }}>
        {subject}
      </Text>

      {/* Salutation */}
      <Text style={{ ...clStyles.body, fontFamily: font.regular, fontSize: layout.fontSize }}>
        {jobPosting?.contactPerson
          ? `Sehr geehrte/r ${jobPosting.contactPerson},`
          : "Sehr geehrte Damen und Herren,"}
      </Text>

      {/* Body paragraphs */}
      {letterText
        .split("\n")
        .filter((p) => p.trim().length > 0)
        .map((p, i) => (
          <Text key={`cl-p-${i}`} style={{ ...clStyles.body, fontSize: layout.fontSize }}>
            {p}
          </Text>
        ))}

      {/* Closing with metadata */}
      {(coverLetterMeta?.entryDate || coverLetterMeta?.salaryExpectation) && (
        <Text style={{ ...clStyles.body, fontSize: layout.fontSize }}>
          {[
            coverLetterMeta?.salaryExpectation
              ? `Meine Gehaltsvorstellung liegt bei ${coverLetterMeta.salaryExpectation}.`
              : "",
            coverLetterMeta?.entryDate
              ? `Ich stehe Ihnen ab dem ${coverLetterMeta.entryDate} zur Verfügung.`
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        </Text>
      )}

      {/* Signature */}
      <View style={clStyles.signature}>
        <Text style={{ fontSize: layout.fontSize }}>Mit freundlichen Grüßen</Text>
        <Text style={{ marginTop: 42, fontFamily: font.bold, fontSize: layout.fontSize + 4 }}>
          {fullName}
        </Text>
      </View>

      {/* Attachments */}
      <View style={clStyles.attachments}>
        <Text style={{ fontSize: layout.fontSize - 1 }}>Anlagen</Text>
      </View>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  TEMPLATE: CLASSIC
//  Clean, conservative, ATS-optimized — single column
// ═══════════════════════════════════════════════════════════

function ClassicCV({ state, layout }: CVProps) {
  const font = getFont(layout.fontFamily);
  const fs = layout.fontSize;
  const pc = layout.primaryColor;
  const sc = layout.secondaryColor;
  const {
    personalData,
    workExperience,
    education,
    skills,
    languages,
    certificates,
    projects,
  } = state;
  const showPhoto = layout.showPhoto && !!personalData.photo;
  const photoLeft = layout.photoPosition === "top-left";

  const s = StyleSheet.create({
    page: {
      paddingLeft: DIN_MARGIN_LEFT,
      paddingRight: DIN_MARGIN_RIGHT,
      paddingTop: DIN_MARGIN_TOP,
      paddingBottom: DIN_MARGIN_BOTTOM,
      fontFamily: font.regular,
      fontSize: fs,
      lineHeight: 1.4,
      color: "#000000",
    },
    header: {
      flexDirection: "row",
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: pc,
      paddingBottom: 10,
    },
    headerCenter: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: pc,
      paddingBottom: 10,
    },
    headerInfo: { flex: 1 },
    name: { fontSize: fs + 10, fontFamily: font.bold, color: pc },
    nameCenter: {
      fontSize: fs + 10,
      fontFamily: font.bold,
      color: pc,
      textAlign: "center",
    },
    subtitle: { fontSize: fs - 1, color: "#4a5568", marginTop: 3 },
    subtitleCenter: {
      fontSize: fs - 1,
      color: "#4a5568",
      marginTop: 3,
      textAlign: "center",
    },
    photo: {
      width: 65,
      height: 80,
      objectFit: "cover",
      borderRadius: 3,
    },
    photoCenter: {
      width: 70,
      height: 70,
      borderRadius: 35,
      objectFit: "cover",
      marginBottom: 8,
    },
    section: { marginTop: 14, marginBottom: 2 },
    sectionTitle: {
      fontSize: fs + 1,
      fontFamily: font.bold,
      color: pc,
      borderBottomWidth: 0.5,
      borderBottomColor: "#cbd5e0",
      paddingBottom: 3,
      marginBottom: 6,
    },
    entryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
    },
    entryTitle: { fontSize: fs, fontFamily: font.bold, flex: 1 },
    entryDate: {
      fontSize: fs - 2,
      color: "#718096",
      minWidth: 90,
      textAlign: "right",
    },
    entrySub: { fontSize: fs - 2, color: "#718096", marginBottom: 2 },
    bullet: { fontSize: fs - 1, paddingLeft: 12, marginBottom: 1 },
    text: { fontSize: fs - 1, marginBottom: 2 },
    skillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginTop: 4,
    },
    skillBadge: {
      fontSize: fs - 2,
      backgroundColor: sc,
      color: pc,
      padding: "2 7",
      borderRadius: 3,
    },
  });

  const isCenter = layout.headerStyle === "centered";
  const isMinimal = layout.headerStyle === "minimal";

  return (
    <Page size="A4" style={s.page} wrap>
      {/* Header */}
      <View style={isMinimal ? { ...s.header, borderBottomWidth: 0.5, paddingBottom: 6, marginBottom: 10 } : isCenter ? s.headerCenter : s.header}>
        {isMinimal ? (
          <>
            <View style={{ flex: 1 }}>
              <Text style={{ ...s.name, fontSize: fs + 2 }}>
                {personalData.firstName} {personalData.lastName}
              </Text>
              <Text style={{ ...s.subtitle, fontSize: fs - 2 }}>
                {[personalData.email, personalData.phone, personalData.address.city].filter(Boolean).join(" · ")}
              </Text>
            </View>
            {showPhoto && (
              <Image src={personalData.photo!} style={{ ...s.photo, width: 50, height: 62, marginLeft: 14 }} />
            )}
          </>
        ) : (
          <>
            {showPhoto && photoLeft && !isCenter && (
              <Image
                src={personalData.photo!}
                style={{ ...s.photo, marginRight: 14 }}
              />
            )}
            {isCenter && showPhoto && (
              <Image src={personalData.photo!} style={s.photoCenter} />
            )}
            <View style={isCenter ? undefined : s.headerInfo}>
              <Text style={isCenter ? s.nameCenter : s.name}>
                {personalData.firstName} {personalData.lastName}
              </Text>
              {state.jobPosting?.jobTitle && (
                <Text style={isCenter ? s.subtitleCenter : s.subtitle}>
                  {state.jobPosting.jobTitle}
                </Text>
              )}
              <Text style={isCenter ? s.subtitleCenter : s.subtitle}>
                {[
                  personalData.email,
                  personalData.phone,
                  [
                    personalData.address.street,
                    personalData.address.zip,
                    personalData.address.city,
                  ]
                    .filter(Boolean)
                    .join(", "),
                ]
                  .filter(Boolean)
                  .join("  ·  ")}
              </Text>
              {personalData.linkedInUrl && (
                <Text style={isCenter ? s.subtitleCenter : s.subtitle}>
                  {personalData.linkedInUrl}
                </Text>
              )}
            </View>
            {showPhoto && !photoLeft && !isCenter && (
              <Image
                src={personalData.photo!}
                style={{ ...s.photo, marginLeft: 14 }}
              />
            )}
          </>
        )}
      </View>

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Berufserfahrung</Text>
          {workExperience.map((exp) => (
            <View key={exp.id} wrap={false}>
              <View style={s.entryRow}>
                <Text style={s.entryTitle}>
                  {exp.jobTitle} — {exp.company}
                </Text>
                <Text style={s.entryDate}>
                  {exp.startDate} –{" "}
                  {exp.isCurrentJob
                    ? "heute"
                    : exp.endDate || "k.A."}
                </Text>
              </View>
              {exp.location && (
                <Text style={s.entrySub}>{exp.location}</Text>
              )}
              {exp.tasks.map((task, i) => (
                <Text key={`t-${exp.id}-${i}`} style={s.bullet}>
                  • {task}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {education.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Bildung</Text>
          {education.map((edu) => (
            <View key={edu.id} wrap={false}>
              <View style={s.entryRow}>
                <Text style={s.entryTitle}>
                  {edu.degree || edu.type} — {edu.institution}
                </Text>
                <Text style={s.entryDate}>
                  {edu.startDate} – {edu.endDate || "heute"}
                </Text>
              </View>
              {(edu.fieldOfStudy || edu.grade) && (
                <Text style={s.entrySub}>
                  {[
                    edu.fieldOfStudy,
                    edu.grade ? `Note: ${edu.grade}` : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Kenntnisse</Text>
          <View style={s.skillRow}>
            {skills.map((skill) => (
              <Text key={skill.id} style={s.skillBadge}>
                {skill.name} {"★".repeat(skill.level)}
                {"☆".repeat(Math.max(0, 5 - skill.level))}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sprachen</Text>
          {languages.map((lang) => (
            <Text key={lang.id} style={s.text}>
              {lang.name} — {lang.level}
            </Text>
          ))}
        </View>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Zertifikate</Text>
          {certificates.map((cert) => (
            <View key={cert.id} wrap={false}>
              <View style={s.entryRow}>
                <Text style={s.entryTitle}>{cert.name}</Text>
                {cert.issueDate && (
                  <Text style={s.entryDate}>{cert.issueDate}</Text>
                )}
              </View>
              {cert.issuingOrganization && (
                <Text style={s.entrySub}>
                  {cert.issuingOrganization}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Projekte</Text>
          {projects.map((proj) => (
            <View key={proj.id} wrap={false}>
              <Text style={s.entryTitle}>{proj.name}</Text>
              {proj.description && (
                <Text style={s.text}>{proj.description}</Text>
              )}
              {proj.technologies.length > 0 && (
                <View style={s.skillRow}>
                  {proj.technologies.map((tech, i) => (
                    <Text
                      key={`tech-${proj.id}-${i}`}
                      style={s.skillBadge}
                    >
                      {tech}
                    </Text>
                  ))}
                </View>
              )}
              {proj.url && (
                <Link
                  src={proj.url}
                  style={{ ...s.text, color: pc }}
                >
                  {proj.url}
                </Link>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  TEMPLATE: MODERN
//  Colored header band, accent bar, professional look
// ═══════════════════════════════════════════════════════════

function ModernCV({ state, layout }: CVProps) {
  const font = getFont(layout.fontFamily);
  const fs = layout.fontSize;
  const pc = layout.primaryColor;
  const sc = layout.secondaryColor;
  const {
    personalData,
    workExperience,
    education,
    skills,
    languages,
    certificates,
    projects,
  } = state;
  const showPhoto = layout.showPhoto && !!personalData.photo;

  const s = StyleSheet.create({
    page: {
      fontFamily: font.regular,
      fontSize: fs,
      lineHeight: 1.4,
      color: "#000000",
    },
    accentBar: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: 6,
      backgroundColor: pc,
    },
    headerBg: {
      backgroundColor: pc,
      padding: `24 ${DIN_MARGIN_RIGHT} 20 ${DIN_MARGIN_LEFT}`,
      flexDirection: "row",
      alignItems: "center",
    },
    headerInfo: { flex: 1 },
    name: {
      fontSize: fs + 12,
      fontFamily: font.bold,
      color: "#ffffff",
    },
    headerSub: {
      fontSize: fs - 1,
      color: "#ffffffcc",
      marginTop: 3,
    },
    photo: {
      width: 64,
      height: 64,
      borderRadius: 32,
      objectFit: "cover",
      marginLeft: 16,
      borderWidth: 2,
      borderColor: "#ffffff80",
    },
    body: {
      paddingLeft: DIN_MARGIN_LEFT,
      paddingRight: DIN_MARGIN_RIGHT,
      paddingTop: 16,
      paddingBottom: DIN_MARGIN_BOTTOM,
    },
    section: { marginTop: 14 },
    sectionTitle: {
      fontSize: fs + 1,
      fontFamily: font.bold,
      color: pc,
      borderBottomWidth: 1.5,
      borderBottomColor: pc,
      paddingBottom: 3,
      marginBottom: 6,
    },
    entryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
    },
    entryTitle: { fontSize: fs, fontFamily: font.bold, flex: 1 },
    entryDate: {
      fontSize: fs - 2,
      color: "#718096",
      minWidth: 90,
      textAlign: "right",
    },
    entrySub: { fontSize: fs - 2, color: "#718096", marginBottom: 2 },
    bullet: { fontSize: fs - 1, paddingLeft: 12, marginBottom: 1 },
    text: { fontSize: fs - 1, marginBottom: 2 },
    skillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginTop: 4,
    },
    skillBadge: {
      fontSize: fs - 2,
      backgroundColor: sc,
      color: pc,
      padding: "2 8",
      borderRadius: 3,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 0.5,
      borderTopColor: "#ffffff40",
    },
    contactItem: { fontSize: fs - 2, color: "#ffffffbb" },
  });

  const isMinimal = layout.headerStyle === "minimal";

  return (
    <Page size="A4" style={s.page} wrap>
      {/* Accent Bar */}
      <View style={s.accentBar} fixed />

      {/* Colored Header */}
      <View style={isMinimal ? { ...s.headerBg, padding: `12 ${DIN_MARGIN_RIGHT} 10 ${DIN_MARGIN_LEFT}` } : s.headerBg}>
        <View style={s.headerInfo}>
          <Text style={isMinimal ? { ...s.name, fontSize: fs + 4 } : s.name}>
            {personalData.firstName} {personalData.lastName}
          </Text>
          {!isMinimal && state.jobPosting?.jobTitle && (
            <Text style={s.headerSub}>
              {state.jobPosting.jobTitle}
            </Text>
          )}
          {isMinimal ? (
            <Text style={{ ...s.contactItem, marginTop: 4 }}>
              {[personalData.email, personalData.phone, personalData.address.city].filter(Boolean).join(" · ")}
            </Text>
          ) : (
            <View style={s.contactRow}>
              {personalData.email && (
                <Text style={s.contactItem}>{personalData.email}</Text>
              )}
              {personalData.phone && (
                <Text style={s.contactItem}>{personalData.phone}</Text>
              )}
              {personalData.address.city && (
                <Text style={s.contactItem}>
                  {personalData.address.zip} {personalData.address.city}
                </Text>
              )}
              {personalData.linkedInUrl && (
                <Text style={s.contactItem}>
                  {personalData.linkedInUrl}
                </Text>
              )}
            </View>
          )}
        </View>
        {showPhoto && (
          <Image src={personalData.photo!} style={isMinimal ? { ...s.photo, width: 48, height: 48, borderRadius: 24 } : s.photo} />
        )}
      </View>

      {/* Body */}
      <View style={s.body}>
        {/* Work Experience */}
        {workExperience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Berufserfahrung</Text>
            {workExperience.map((exp) => (
              <View key={exp.id} wrap={false}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>
                    {exp.jobTitle} — {exp.company}
                  </Text>
                  <Text style={s.entryDate}>
                    {exp.startDate} –{" "}
                    {exp.isCurrentJob
                      ? "heute"
                      : exp.endDate || "k.A."}
                  </Text>
                </View>
                {exp.location && (
                  <Text style={s.entrySub}>{exp.location}</Text>
                )}
                {exp.tasks.map((task, i) => (
                  <Text key={`t-${exp.id}-${i}`} style={s.bullet}>
                    • {task}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Bildung</Text>
            {education.map((edu) => (
              <View key={edu.id} wrap={false}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>
                    {edu.degree || edu.type} — {edu.institution}
                  </Text>
                  <Text style={s.entryDate}>
                    {edu.startDate} – {edu.endDate || "heute"}
                  </Text>
                </View>
                {(edu.fieldOfStudy || edu.grade) && (
                  <Text style={s.entrySub}>
                    {[
                      edu.fieldOfStudy,
                      edu.grade ? `Note: ${edu.grade}` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Kenntnisse</Text>
            <View style={s.skillRow}>
              {skills.map((skill) => (
                <Text key={skill.id} style={s.skillBadge}>
                  {skill.name} {"★".repeat(skill.level)}
                  {"☆".repeat(Math.max(0, 5 - skill.level))}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Sprachen</Text>
            {languages.map((lang) => (
              <Text key={lang.id} style={s.text}>
                {lang.name} — {lang.level}
              </Text>
            ))}
          </View>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Zertifikate</Text>
            {certificates.map((cert) => (
              <View key={cert.id} wrap={false}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{cert.name}</Text>
                  {cert.issueDate && (
                    <Text style={s.entryDate}>{cert.issueDate}</Text>
                  )}
                </View>
                {cert.issuingOrganization && (
                  <Text style={s.entrySub}>
                    {cert.issuingOrganization}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Projekte</Text>
            {projects.map((proj) => (
              <View key={proj.id} wrap={false}>
                <Text style={s.entryTitle}>{proj.name}</Text>
                {proj.description && (
                  <Text style={s.text}>{proj.description}</Text>
                )}
                {proj.technologies.length > 0 && (
                  <View style={s.skillRow}>
                    {proj.technologies.map((tech, i) => (
                      <Text
                        key={`tech-${proj.id}-${i}`}
                        style={s.skillBadge}
                      >
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
                {proj.url && (
                  <Link
                    src={proj.url}
                    style={{ ...s.text, color: pc }}
                  >
                    {proj.url}
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  TEMPLATE: CREATIVE
//  Two-column layout — sidebar with photo/skills, main body
// ═══════════════════════════════════════════════════════════

function CreativeCV({ state, layout }: CVProps) {
  const font = getFont(layout.fontFamily);
  const fs = layout.fontSize;
  const pc = layout.primaryColor;
  const sc = layout.secondaryColor;
  const {
    personalData,
    workExperience,
    education,
    skills,
    languages,
    certificates,
    projects,
  } = state;
  const showPhoto = layout.showPhoto && !!personalData.photo;
  const isMinimal = layout.headerStyle === "minimal";
  const sidebarWidth = isMinimal ? 130 : 170;

  const s = StyleSheet.create({
    page: {
      fontFamily: font.regular,
      fontSize: fs,
      lineHeight: 1.4,
      color: "#000000",
    },
    wrapper: { flexDirection: "row", minHeight: "100%" },
    // ── Sidebar ──
    sidebar: {
      width: sidebarWidth,
      backgroundColor: pc,
      color: "#ffffff",
      padding: "30 16 30 16",
    },
    sidebarPhoto: {
      width: 90,
      height: 90,
      borderRadius: 45,
      objectFit: "cover",
      alignSelf: "center",
      marginBottom: 16,
      borderWidth: 3,
      borderColor: "#ffffff50",
    },
    sidebarName: {
      fontSize: fs + 4,
      fontFamily: font.bold,
      color: "#ffffff",
      textAlign: "center",
      marginBottom: 4,
    },
    sidebarTitle: {
      fontSize: fs - 1,
      color: "#ffffffcc",
      textAlign: "center",
      marginBottom: 16,
    },
    sidebarSectionTitle: {
      fontSize: fs - 1,
      fontFamily: font.bold,
      color: "#ffffff",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginTop: 14,
      marginBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#ffffff40",
      paddingBottom: 3,
    },
    sidebarText: {
      fontSize: fs - 2,
      color: "#ffffffdd",
      marginBottom: 2,
    },
    sidebarSkillRow: { marginBottom: 4 },
    sidebarSkillName: {
      fontSize: fs - 2,
      color: "#ffffff",
      marginBottom: 1,
    },
    sidebarSkillBar: {
      height: 4,
      backgroundColor: "#ffffff30",
      borderRadius: 2,
    },
    sidebarSkillFill: {
      height: 4,
      backgroundColor: "#ffffff",
      borderRadius: 2,
    },
    // ── Main Content ──
    main: {
      flex: 1,
      paddingLeft: 24,
      paddingRight: DIN_MARGIN_RIGHT,
      paddingTop: DIN_MARGIN_TOP,
      paddingBottom: DIN_MARGIN_BOTTOM,
    },
    section: { marginTop: 14 },
    sectionTitle: {
      fontSize: fs + 1,
      fontFamily: font.bold,
      color: pc,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginBottom: 6,
      borderBottomWidth: 2,
      borderBottomColor: pc,
      paddingBottom: 3,
    },
    entryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
    },
    entryTitle: { fontSize: fs, fontFamily: font.bold, flex: 1 },
    entryDate: {
      fontSize: fs - 2,
      color: "#718096",
      minWidth: 80,
      textAlign: "right",
    },
    entrySub: { fontSize: fs - 2, color: "#718096", marginBottom: 2 },
    bullet: { fontSize: fs - 1, paddingLeft: 10, marginBottom: 1 },
    text: { fontSize: fs - 1, marginBottom: 2 },
    techRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 3,
      marginTop: 3,
    },
    techBadge: {
      fontSize: fs - 3,
      backgroundColor: sc,
      color: pc,
      padding: "2 6",
      borderRadius: 8,
    },
  });

  return (
    <Page size="A4" style={s.page} wrap>
      <View style={s.wrapper}>
        {/* ── Sidebar ── */}
        <View style={isMinimal ? { ...s.sidebar, padding: "20 12 20 12" } : s.sidebar} fixed>
          {showPhoto && (
            <Image
              src={personalData.photo!}
              style={isMinimal ? { ...s.sidebarPhoto, width: 60, height: 60, borderRadius: 30, marginBottom: 10 } : s.sidebarPhoto}
            />
          )}
          <Text style={isMinimal ? { ...s.sidebarName, fontSize: fs + 1 } : s.sidebarName}>
            {personalData.firstName} {personalData.lastName}
          </Text>
          {!isMinimal && state.jobPosting?.jobTitle && (
            <Text style={s.sidebarTitle}>
              {state.jobPosting.jobTitle}
            </Text>
          )}

          {/* Contact */}
          {!isMinimal && <Text style={s.sidebarSectionTitle}>Kontakt</Text>}
          {personalData.email && (
            <Text style={s.sidebarText}>{personalData.email}</Text>
          )}
          {personalData.phone && (
            <Text style={s.sidebarText}>{personalData.phone}</Text>
          )}
          {personalData.address.city && (
            <Text style={s.sidebarText}>
              {personalData.address.zip} {personalData.address.city}
            </Text>
          )}
          {personalData.linkedInUrl && (
            <Text style={s.sidebarText}>
              {personalData.linkedInUrl}
            </Text>
          )}

          {/* Skills in sidebar */}
          {skills.length > 0 && (
            <>
              {!isMinimal && <Text style={s.sidebarSectionTitle}>Kenntnisse</Text>}
              {isMinimal && <View style={{ marginTop: 8 }} />}
              {skills.map((skill) => (
                <View key={skill.id} style={s.sidebarSkillRow}>
                  <Text style={s.sidebarSkillName}>
                    {skill.name}
                  </Text>
                  <View style={s.sidebarSkillBar}>
                    <View
                      style={{
                        ...s.sidebarSkillFill,
                        width: `${(skill.level / 5) * 100}%`,
                      }}
                    />
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Languages in sidebar */}
          {languages.length > 0 && (
            <>
              {!isMinimal && <Text style={s.sidebarSectionTitle}>Sprachen</Text>}
              {isMinimal && <View style={{ marginTop: 6 }} />}
              {languages.map((lang) => (
                <Text key={lang.id} style={s.sidebarText}>
                  {lang.name} — {lang.level}
                </Text>
              ))}
            </>
          )}
        </View>

        {/* ── Main Content ── */}
        <View style={s.main}>
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Berufserfahrung</Text>
              {workExperience.map((exp) => (
                <View key={exp.id} wrap={false}>
                  <View style={s.entryRow}>
                    <Text style={s.entryTitle}>
                      {exp.jobTitle} — {exp.company}
                    </Text>
                    <Text style={s.entryDate}>
                      {exp.startDate} –{" "}
                      {exp.isCurrentJob
                        ? "heute"
                        : exp.endDate || "k.A."}
                    </Text>
                  </View>
                  {exp.location && (
                    <Text style={s.entrySub}>{exp.location}</Text>
                  )}
                  {exp.tasks.map((task, i) => (
                    <Text
                      key={`t-${exp.id}-${i}`}
                      style={s.bullet}
                    >
                      • {task}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Bildung</Text>
              {education.map((edu) => (
                <View key={edu.id} wrap={false}>
                  <View style={s.entryRow}>
                    <Text style={s.entryTitle}>
                      {edu.degree || edu.type} — {edu.institution}
                    </Text>
                    <Text style={s.entryDate}>
                      {edu.startDate} – {edu.endDate || "heute"}
                    </Text>
                  </View>
                  {(edu.fieldOfStudy || edu.grade) && (
                    <Text style={s.entrySub}>
                      {[
                        edu.fieldOfStudy,
                        edu.grade ? `Note: ${edu.grade}` : "",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Zertifikate</Text>
              {certificates.map((cert) => (
                <View key={cert.id} wrap={false}>
                  <View style={s.entryRow}>
                    <Text style={s.entryTitle}>{cert.name}</Text>
                    {cert.issueDate && (
                      <Text style={s.entryDate}>
                        {cert.issueDate}
                      </Text>
                    )}
                  </View>
                  {cert.issuingOrganization && (
                    <Text style={s.entrySub}>
                      {cert.issuingOrganization}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Projekte</Text>
              {projects.map((proj) => (
                <View key={proj.id} wrap={false}>
                  <Text style={s.entryTitle}>{proj.name}</Text>
                  {proj.description && (
                    <Text style={s.text}>{proj.description}</Text>
                  )}
                  {proj.technologies.length > 0 && (
                    <View style={s.techRow}>
                      {proj.technologies.map((tech, i) => (
                        <Text
                          key={`tech-${proj.id}-${i}`}
                          style={s.techBadge}
                        >
                          {tech}
                        </Text>
                      ))}
                    </View>
                  )}
                  {proj.url && (
                    <Link
                      src={proj.url}
                      style={{ ...s.text, color: pc }}
                    >
                      {proj.url}
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  TEMPLATE: TECH
//  Optimized for Software Developers, DevOps, Data Scientists
//  Tech Stack first, Projects before Work Experience, ATS-optimized
// ═══════════════════════════════════════════════════════════

function TechCV({ state, layout }: CVProps) {
  const font = getFont(layout.fontFamily);
  const fs = layout.fontSize;
  const pc = layout.primaryColor;
  const sc = layout.secondaryColor;
  const {
    personalData,
    workExperience,
    education,
    skills,
    languages,
    certificates,
    projects,
  } = state;

  // Helper: Categorize skills into tech groups
  const categorizeSkills = (skills: typeof state.skills) => {
    const categories = {
      languages: [] as string[],
      frontend: [] as string[],
      backend: [] as string[],
      devops: [] as string[],
      other: [] as string[],
    };

    const languageKeywords = ["javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin", "scala", "r"];
    const frontendKeywords = ["react", "vue", "angular", "next", "svelte", "tailwind", "css", "html", "sass", "redux", "webpack", "vite"];
    const backendKeywords = ["node", "express", "fastapi", "django", "flask", "spring", "nestjs", "graphql", "rest", "api", "sql", "postgres", "mysql", "mongodb", "redis"];
    const devopsKeywords = ["docker", "kubernetes", "k8s", "aws", "azure", "gcp", "ci/cd", "jenkins", "github actions", "terraform", "ansible", "linux", "nginx"];

    skills.forEach((skill) => {
      const name = skill.name.toLowerCase();
      if (languageKeywords.some((kw) => name.includes(kw))) {
        categories.languages.push(skill.name);
      } else if (frontendKeywords.some((kw) => name.includes(kw))) {
        categories.frontend.push(skill.name);
      } else if (backendKeywords.some((kw) => name.includes(kw))) {
        categories.backend.push(skill.name);
      } else if (devopsKeywords.some((kw) => name.includes(kw))) {
        categories.devops.push(skill.name);
      } else {
        categories.other.push(skill.name);
      }
    });

    return categories;
  };

  const techStack = categorizeSkills(skills);

  const s = StyleSheet.create({
    page: {
      paddingLeft: DIN_MARGIN_LEFT,
      paddingRight: DIN_MARGIN_RIGHT,
      paddingTop: DIN_MARGIN_TOP,
      paddingBottom: DIN_MARGIN_BOTTOM,
      fontFamily: font.regular,
      fontSize: fs,
      lineHeight: 1.4,
      color: "#0f172a",
    },
    header: {
      marginBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: pc,
      paddingBottom: 8,
    },
    name: {
      fontSize: fs + 8,
      fontFamily: font.bold,
      color: pc,
    },
    subtitle: {
      fontSize: fs + 1,
      color: sc,
      marginTop: 2,
    },
    contact: {
      fontSize: fs - 1,
      color: "#475569",
      marginTop: 4,
    },
    linkText: {
      fontSize: fs - 1,
      color: pc,
      marginTop: 2,
    },
    section: {
      marginTop: 12,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: fs + 2,
      fontFamily: font.bold,
      color: pc,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: "#cbd5e0",
      paddingBottom: 3,
    },
    techCategory: {
      flexDirection: "row",
      marginBottom: 3,
    },
    techLabel: {
      fontSize: fs - 1,
      fontFamily: font.bold,
      color: sc,
      minWidth: 80,
    },
    techList: {
      fontSize: fs - 1,
      color: "#1e293b",
      flex: 1,
    },
    projectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    projectTitle: {
      fontSize: fs,
      fontFamily: font.bold,
      color: "#1e293b",
    },
    projectDate: {
      fontSize: fs - 2,
      color: "#64748b",
    },
    projectDesc: {
      fontSize: fs - 1,
      color: "#475569",
      marginBottom: 2,
      paddingLeft: 8,
    },
    projectTech: {
      fontSize: fs - 2,
      color: pc,
      marginBottom: 2,
      paddingLeft: 8,
    },
    projectUrl: {
      fontSize: fs - 2,
      color: pc,
      marginBottom: 4,
      paddingLeft: 8,
    },
    entryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    entryTitle: {
      fontSize: fs,
      fontFamily: font.bold,
      color: "#1e293b",
      flex: 1,
    },
    entryDate: {
      fontSize: fs - 2,
      color: "#64748b",
      minWidth: 90,
      textAlign: "right",
    },
    entrySub: {
      fontSize: fs - 1,
      color: "#64748b",
      marginBottom: 2,
    },
    bullet: {
      fontSize: fs - 1,
      paddingLeft: 12,
      marginBottom: 1,
      color: "#334155",
    },
    certRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 3,
    },
    certName: {
      fontSize: fs - 1,
      fontFamily: font.bold,
      flex: 1,
    },
    certDate: {
      fontSize: fs - 2,
      color: "#64748b",
    },
    certOrg: {
      fontSize: fs - 2,
      color: "#64748b",
      paddingLeft: 8,
    },
  });

  const isMinimal = layout.headerStyle === "minimal";

  return (
    <Page size="A4" style={s.page} wrap>
      {/* Header */}
      <View style={isMinimal ? { ...s.header, paddingBottom: 5, marginBottom: 8 } : s.header}>
        <Text style={isMinimal ? { ...s.name, fontSize: fs + 2 } : s.name}>
          {personalData.firstName} {personalData.lastName}
        </Text>
        {!isMinimal && state.jobPosting?.jobTitle && (
          <Text style={s.subtitle}>{state.jobPosting.jobTitle}</Text>
        )}
        <Text style={s.contact}>
          {[personalData.email, personalData.phone]
            .filter(Boolean)
            .join(" • ")}
        </Text>
        {!isMinimal && (personalData.linkedInUrl || personalData.portfolioUrl) && (
          <Text style={s.linkText}>
            {[personalData.linkedInUrl, personalData.portfolioUrl]
              .filter(Boolean)
              .join(" • ")}
          </Text>
        )}
      </View>

      {/* Tech Stack Section - FIRST! */}
      {skills.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Tech Stack</Text>
          {techStack.languages.length > 0 && (
            <View style={s.techCategory}>
              <Text style={s.techLabel}>Languages:</Text>
              <Text style={s.techList}>{techStack.languages.join(", ")}</Text>
            </View>
          )}
          {techStack.frontend.length > 0 && (
            <View style={s.techCategory}>
              <Text style={s.techLabel}>Frontend:</Text>
              <Text style={s.techList}>{techStack.frontend.join(", ")}</Text>
            </View>
          )}
          {techStack.backend.length > 0 && (
            <View style={s.techCategory}>
              <Text style={s.techLabel}>Backend:</Text>
              <Text style={s.techList}>{techStack.backend.join(", ")}</Text>
            </View>
          )}
          {techStack.devops.length > 0 && (
            <View style={s.techCategory}>
              <Text style={s.techLabel}>DevOps:</Text>
              <Text style={s.techList}>{techStack.devops.join(", ")}</Text>
            </View>
          )}
          {techStack.other.length > 0 && (
            <View style={s.techCategory}>
              <Text style={s.techLabel}>Other:</Text>
              <Text style={s.techList}>{techStack.other.join(", ")}</Text>
            </View>
          )}
        </View>
      )}

      {/* Projects Section - BEFORE Work Experience! */}
      {projects.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Key Projects</Text>
          {projects.map((proj) => (
            <View key={proj.id} wrap={false}>
              <View style={s.projectHeader}>
                <Text style={s.projectTitle}>{proj.name}</Text>
                <Text style={s.projectDate}>
                  {proj.startDate}
                  {proj.endDate ? ` – ${proj.endDate}` : " – present"}
                </Text>
              </View>
              {proj.role && (
                <Text style={s.entrySub}>{proj.role}</Text>
              )}
              {proj.description && (
                <Text style={s.projectDesc}>→ {proj.description}</Text>
              )}
              {proj.technologies.length > 0 && (
                <Text style={s.projectTech}>
                  → {proj.technologies.join(", ")}
                </Text>
              )}
              {proj.url && (
                <Link src={proj.url} style={s.projectUrl}>
                  → {proj.url}
                </Link>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Professional Experience */}
      {workExperience.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Professional Experience</Text>
          {workExperience.map((exp) => (
            <View key={exp.id} wrap={false}>
              <View style={s.entryRow}>
                <Text style={s.entryTitle}>
                  {exp.jobTitle} @ {exp.company}
                </Text>
                <Text style={s.entryDate}>
                  {exp.startDate} –{" "}
                  {exp.isCurrentJob ? "present" : exp.endDate || "N/A"}
                </Text>
              </View>
              {exp.location && <Text style={s.entrySub}>{exp.location}</Text>}
              {exp.tasks.map((task, i) => (
                <Text key={`t-${exp.id}-${i}`} style={s.bullet}>
                  • {task}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {education.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Education</Text>
          {education.map((edu) => (
            <View key={edu.id} wrap={false}>
              <View style={s.entryRow}>
                <Text style={s.entryTitle}>
                  {edu.degree || edu.type} — {edu.institution}
                </Text>
                <Text style={s.entryDate}>
                  {edu.startDate} – {edu.endDate || "present"}
                </Text>
              </View>
              {(edu.fieldOfStudy || edu.grade) && (
                <Text style={s.entrySub}>
                  {[
                    edu.fieldOfStudy,
                    edu.grade ? `Grade: ${edu.grade}` : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Certifications - Separate Section */}
      {certificates.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Certifications</Text>
          {certificates.map((cert) => (
            <View key={cert.id} wrap={false}>
              <View style={s.certRow}>
                <Text style={s.certName}>{cert.name}</Text>
                {cert.issueDate && (
                  <Text style={s.certDate}>{cert.issueDate}</Text>
                )}
              </View>
              {cert.issuingOrganization && (
                <Text style={s.certOrg}>{cert.issuingOrganization}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Languages</Text>
          <View style={s.techCategory}>
            <Text style={s.techList}>
              {languages.map((lang) => `${lang.name} (${lang.level})`).join(", ")}
            </Text>
          </View>
        </View>
      )}
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  TEMPLATE: EXECUTIVE
//  Elegant, understated — board-ready design for leadership
// ═══════════════════════════════════════════════════════════

function ExecutiveCV({ state, layout }: CVProps) {
  const font = getFont(layout.fontFamily);
  const fs = layout.fontSize;
  const pc = layout.primaryColor;
  const {
    personalData,
    workExperience,
    education,
    skills,
    languages,
    certificates,
    projects,
  } = state;
  const showPhoto = layout.showPhoto && !!personalData.photo;
  const isMinimal = layout.headerStyle === "minimal";

  const s = StyleSheet.create({
    page: {
      paddingLeft: DIN_MARGIN_LEFT,
      paddingRight: DIN_MARGIN_RIGHT,
      paddingTop: DIN_MARGIN_TOP,
      paddingBottom: DIN_MARGIN_BOTTOM,
      fontFamily: font.regular,
      fontSize: fs,
      lineHeight: 1.5,
      color: "#333333",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    headerInfo: { flex: 1 },
    name: {
      fontSize: fs + 12,
      fontFamily: font.bold,
      color: pc,
      letterSpacing: 1.5,
      marginBottom: 4,
    },
    nameMinimal: {
      fontSize: fs + 6,
      fontFamily: font.bold,
      color: pc,
      letterSpacing: 1,
      marginBottom: 2,
    },
    contactLine: {
      fontSize: fs - 2,
      color: "#666666",
      letterSpacing: 0.3,
      marginBottom: 2,
    },
    headerDivider: {
      borderBottomWidth: 1,
      borderBottomColor: pc,
      marginTop: 10,
      marginBottom: 18,
    },
    headerDividerMinimal: {
      borderBottomWidth: 0.5,
      borderBottomColor: "#cccccc",
      marginTop: 6,
      marginBottom: 12,
    },
    photo: {
      width: 60,
      height: 75,
      objectFit: "cover",
      marginLeft: 20,
    },
    section: { marginTop: 16, marginBottom: 2 },
    sectionTitle: {
      fontSize: fs - 1,
      fontFamily: font.bold,
      color: pc,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 4,
    },
    sectionUnderline: {
      borderBottomWidth: 0.75,
      borderBottomColor: pc,
      marginBottom: 8,
      width: 50,
    },
    entryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: 8,
    },
    entryTitle: {
      fontSize: fs,
      fontFamily: font.bold,
      color: "#1a1a1a",
      flex: 1,
    },
    entryDate: {
      fontSize: fs - 2,
      color: "#888888",
      minWidth: 95,
      textAlign: "right",
    },
    entrySub: {
      fontSize: fs - 1,
      color: "#666666",
      marginBottom: 3,
    },
    bullet: {
      fontSize: fs - 1,
      paddingLeft: 12,
      marginBottom: 1.5,
      color: "#444444",
    },
    text: { fontSize: fs - 1, marginBottom: 2, color: "#444444" },
    inlineText: {
      fontSize: fs - 1,
      color: "#444444",
      marginTop: 4,
    },
  });

  return (
    <Page size="A4" style={s.page} wrap>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerInfo}>
          <Text style={isMinimal ? s.nameMinimal : s.name}>
            {personalData.firstName} {personalData.lastName}
          </Text>
          <Text style={s.contactLine}>
            {[personalData.email, personalData.phone].filter(Boolean).join("  ·  ")}
          </Text>
          <Text style={s.contactLine}>
            {[
              personalData.address.street,
              [personalData.address.zip, personalData.address.city].filter(Boolean).join(" "),
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>
          {personalData.linkedInUrl && (
            <Text style={s.contactLine}>{personalData.linkedInUrl}</Text>
          )}
        </View>
        {showPhoto && (
          <Image src={personalData.photo!} style={s.photo} />
        )}
      </View>
      <View style={isMinimal ? s.headerDividerMinimal : s.headerDivider} />

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Berufserfahrung</Text>
          <View style={s.sectionUnderline} />
          {workExperience.map((exp) => (
            <View key={exp.id} wrap={false}>
              <View style={s.entryRow}>
                <Text style={s.entryTitle}>
                  {exp.jobTitle} — {exp.company}
                </Text>
                <Text style={s.entryDate}>
                  {exp.startDate} – {exp.isCurrentJob ? "heute" : exp.endDate || "k.A."}
                </Text>
              </View>
              {exp.location && <Text style={s.entrySub}>{exp.location}</Text>}
              {exp.tasks.map((task, i) => (
                <Text key={`t-${exp.id}-${i}`} style={s.bullet}>
                  • {task}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {education.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Bildung</Text>
          <View style={s.sectionUnderline} />
          {education.map((edu) => (
            <View key={edu.id} wrap={false}>
              <View style={s.entryRow}>
                <Text style={s.entryTitle}>
                  {edu.degree || edu.type} — {edu.institution}
                </Text>
                <Text style={s.entryDate}>
                  {edu.startDate} – {edu.endDate || "heute"}
                </Text>
              </View>
              {(edu.fieldOfStudy || edu.grade) && (
                <Text style={s.entrySub}>
                  {[edu.fieldOfStudy, edu.grade ? `Note: ${edu.grade}` : ""].filter(Boolean).join(" · ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Projekte</Text>
          <View style={s.sectionUnderline} />
          {projects.map((proj) => (
            <View key={proj.id} wrap={false}>
              <Text style={s.entryTitle}>{proj.name}</Text>
              {proj.description && <Text style={s.text}>{proj.description}</Text>}
              {proj.url && (
                <Link src={proj.url} style={{ ...s.text, color: pc }}>
                  {proj.url}
                </Link>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Kenntnisse</Text>
          <View style={s.sectionUnderline} />
          <Text style={s.inlineText}>
            {skills.map((skill) => skill.name).join(", ")}
          </Text>
        </View>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sprachen</Text>
          <View style={s.sectionUnderline} />
          <Text style={s.inlineText}>
            {languages.map((lang) => `${lang.name} (${lang.level})`).join("  ·  ")}
          </Text>
        </View>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Zertifikate</Text>
          <View style={s.sectionUnderline} />
          {certificates.map((cert) => (
            <View key={cert.id} wrap={false}>
              <View style={s.entryRow}>
                <Text style={s.entryTitle}>{cert.name}</Text>
                {cert.issueDate && <Text style={s.entryDate}>{cert.issueDate}</Text>}
              </View>
              {cert.issuingOrganization && (
                <Text style={s.entrySub}>{cert.issuingOrganization}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  TEMPLATE: ACADEMIC
//  Multi-page, research-focused, dense information layout
// ═══════════════════════════════════════════════════════════

function AcademicCV({ state, layout }: CVProps) {
  const font = getFont(layout.fontFamily);
  const fs = layout.fontSize;
  const pc = layout.primaryColor;
  const {
    personalData,
    workExperience,
    education,
    skills,
    languages,
    certificates,
    projects,
  } = state;
  const showPhoto = layout.showPhoto && !!personalData.photo;

  const s = StyleSheet.create({
    page: {
      paddingLeft: DIN_MARGIN_LEFT,
      paddingRight: DIN_MARGIN_RIGHT,
      paddingTop: DIN_MARGIN_TOP,
      paddingBottom: DIN_MARGIN_BOTTOM,
      fontFamily: font.regular,
      fontSize: fs,
      lineHeight: 1.4,
      color: "#1a202c",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6,
    },
    headerInfo: { flex: 1 },
    name: {
      fontSize: fs + 10,
      fontFamily: font.bold,
      color: pc,
      marginBottom: 4,
    },
    contactRow: {
      fontSize: fs - 2,
      color: "#4a5568",
      marginBottom: 1.5,
    },
    photo: {
      width: 55,
      height: 70,
      objectFit: "cover",
      marginLeft: 16,
    },
    headerDivider: {
      borderBottomWidth: 2,
      borderBottomColor: pc,
      marginTop: 8,
      marginBottom: 14,
    },
    section: { marginTop: 12, marginBottom: 2 },
    sectionTitle: {
      fontSize: fs + 1,
      fontFamily: font.bold,
      color: pc,
      borderBottomWidth: 2,
      borderBottomColor: pc,
      paddingBottom: 2,
      marginBottom: 6,
    },
    entryBlock: { marginTop: 5, marginBottom: 3 },
    entryTitle: {
      fontSize: fs,
      fontFamily: font.bold,
      color: "#1a202c",
    },
    entryDate: {
      fontSize: fs - 2,
      color: "#4a5568",
      marginBottom: 1,
    },
    entrySub: {
      fontSize: fs - 1,
      color: "#4a5568",
      marginBottom: 2,
    },
    bullet: {
      fontSize: fs - 1,
      paddingLeft: 12,
      marginBottom: 1,
    },
    text: { fontSize: fs - 1, marginBottom: 2 },
    pubEntry: {
      marginTop: 4,
      marginBottom: 3,
    },
    pubTitle: {
      fontSize: fs,
      fontFamily: font.bold,
      color: "#1a202c",
    },
    pubMeta: {
      fontSize: fs - 2,
      color: "#4a5568",
      marginBottom: 1,
    },
    pubDesc: {
      fontSize: fs - 1,
      color: "#2d3748",
      marginBottom: 1,
    },
    link: {
      fontSize: fs - 2,
      color: pc,
    },
    inlineText: {
      fontSize: fs - 1,
      color: "#2d3748",
      marginTop: 3,
    },
    skillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 3,
      marginTop: 3,
    },
    skillBadge: {
      fontSize: fs - 2,
      backgroundColor: layout.secondaryColor,
      color: pc,
      padding: "2 6",
      borderRadius: 2,
    },
  });

  // Use first project description as research interests summary
  const researchSummary = projects.length > 0 ? projects[0].description : null;

  return (
    <Page size="A4" style={s.page} wrap>
      {/* Header / Personal Info */}
      <View style={s.header}>
        <View style={s.headerInfo}>
          <Text style={s.name}>
            {personalData.firstName} {personalData.lastName}
          </Text>
          {state.jobPosting?.jobTitle && (
            <Text style={s.contactRow}>{state.jobPosting.jobTitle}</Text>
          )}
          <Text style={s.contactRow}>
            {[personalData.email, personalData.phone].filter(Boolean).join("  ·  ")}
          </Text>
          <Text style={s.contactRow}>
            {[
              personalData.address.street,
              [personalData.address.zip, personalData.address.city].filter(Boolean).join(" "),
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>
          {personalData.linkedInUrl && (
            <Link src={personalData.linkedInUrl} style={s.link}>
              {personalData.linkedInUrl}
            </Link>
          )}
        </View>
        {showPhoto && (
          <Image src={personalData.photo!} style={s.photo} />
        )}
      </View>
      <View style={s.headerDivider} />

      {/* Research Interests */}
      {researchSummary && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Forschungsinteressen</Text>
          <Text style={s.text}>{researchSummary}</Text>
        </View>
      )}

      {/* Education */}
      {education.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Bildung</Text>
          {education.map((edu) => (
            <View key={edu.id} style={s.entryBlock} wrap={false}>
              <Text style={s.entryTitle}>
                {edu.degree || edu.type} — {edu.institution}
              </Text>
              <Text style={s.entryDate}>
                {edu.startDate} – {edu.endDate || "heute"}
              </Text>
              {(edu.fieldOfStudy || edu.grade) && (
                <Text style={s.entrySub}>
                  {[edu.fieldOfStudy, edu.grade ? `Note: ${edu.grade}` : ""].filter(Boolean).join(" · ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Publications / Projects */}
      {projects.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Publikationen & Projekte</Text>
          {projects.map((proj) => (
            <View key={proj.id} style={s.pubEntry} wrap={false}>
              <Text style={s.pubTitle}>{proj.name}</Text>
              {proj.description && <Text style={s.pubDesc}>{proj.description}</Text>}
              {proj.technologies.length > 0 && (
                <Text style={s.pubMeta}>
                  Technologien: {proj.technologies.join(", ")}
                </Text>
              )}
              {proj.url && (
                <Link src={proj.url} style={s.link}>
                  {proj.url}
                </Link>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Work Experience — Akademische Laufbahn */}
      {workExperience.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Akademische Laufbahn</Text>
          {workExperience.map((exp) => (
            <View key={exp.id} style={s.entryBlock} wrap={false}>
              <Text style={s.entryTitle}>
                {exp.jobTitle} — {exp.company}
              </Text>
              <Text style={s.entryDate}>
                {exp.startDate} – {exp.isCurrentJob ? "heute" : exp.endDate || "k.A."}
              </Text>
              {exp.location && <Text style={s.entrySub}>{exp.location}</Text>}
              {exp.tasks.map((task, i) => (
                <Text key={`t-${exp.id}-${i}`} style={s.bullet}>
                  • {task}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Certificates — Auszeichnungen & Zertifikate */}
      {certificates.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Auszeichnungen & Zertifikate</Text>
          {certificates.map((cert) => (
            <View key={cert.id} style={s.entryBlock} wrap={false}>
              <Text style={s.entryTitle}>{cert.name}</Text>
              <Text style={s.entryDate}>
                {[cert.issuingOrganization, cert.issueDate].filter(Boolean).join(", ")}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Kenntnisse</Text>
          <View style={s.skillRow}>
            {skills.map((skill) => (
              <Text key={skill.id} style={s.skillBadge}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sprachen</Text>
          <Text style={s.inlineText}>
            {languages.map((lang) => `${lang.name} (${lang.level})`).join("  ·  ")}
          </Text>
        </View>
      )}
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  TEMPLATE ROUTER — picks the right CV template
// ═══════════════════════════════════════════════════════════

function CVTemplateRouter(props: CVProps) {
  switch (props.layout.templateId) {
    case "tech":
      return <TechCV {...props} />;
    case "modern":
      return <ModernCV {...props} />;
    case "creative":
      return <CreativeCV {...props} />;
    case "executive":
      return <ExecutiveCV {...props} />;
    case "academic":
      return <AcademicCV {...props} />;
    case "classic":
    default:
      return <ClassicCV {...props} />;
  }
}

// ═══════════════════════════════════════════════════════════
//  FULL DOCUMENT ASSEMBLY
// ═══════════════════════════════════════════════════════════

function ApplicationPdfDocument({ state }: { state: ApplicationState }) {
  const {
    documentSelection,
    layoutConfig,
    personalData,
    coverLetter,
    coverLetterMeta,
    jobPosting,
  } = state;

  return (
    <Document>
      {/* 1. Cover Page (Deckblatt) */}
      {documentSelection.includeCoverPage && (
        <CoverPageSection
          personalData={personalData}
          jobPosting={jobPosting}
          layout={layoutConfig}
        />
      )}

      {/* 2. Cover Letter (Anschreiben) */}
      {documentSelection.includeCoverLetter && coverLetter && (
        <CoverLetterSection
          personalData={personalData}
          coverLetter={coverLetter}
          coverLetterMeta={coverLetterMeta}
          jobPosting={jobPosting}
          layout={layoutConfig}
        />
      )}

      {/* 3. CV (Lebenslauf) */}
      {documentSelection.includeCV && (
        <CVTemplateRouter state={state} layout={layoutConfig} />
      )}
    </Document>
  );
}

// ─── Public API ────────────────────────────────────────────

export async function exportAsPdf(
  state: ApplicationState,
): Promise<Blob> {
  const doc = <ApplicationPdfDocument state={state} />;
  const blob = await pdf(doc).toBlob();

  const fullName = [
    state.personalData.firstName,
    state.personalData.lastName,
  ]
    .filter(Boolean)
    .join(" ");
  const jobTitle = state.jobPosting?.jobTitle ?? "";
  const companyName = state.jobPosting?.companyName ?? "";
  const skillKeywords = state.skills.map((s) => s.name);

  const metadata = {
    title: jobTitle
      ? `Bewerbung - ${jobTitle} - ${fullName}`
      : `Lebenslauf - ${fullName}`,
    author: fullName,
    subject: companyName
      ? `Bewerbung für ${jobTitle} bei ${companyName}`
      : `Lebenslauf von ${fullName}`,
    keywords: [jobTitle, companyName, ...skillKeywords].filter(Boolean),
    creator: "Job Letter Builder (mm-jlb)",
  };

  return addPdfMetadata(blob, metadata);
}

export async function downloadPdf(
  state: ApplicationState,
): Promise<void> {
  const blob = await exportAsPdf(state);
  const lastName = (state.personalData.lastName || "Bewerbung").replace(
    /[^a-zA-Z0-9äöüÄÖÜß_-]/g,
    "_",
  );
  const company = (
    state.jobPosting?.companyName || "Firma"
  ).replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_");
  const fileName = `Bewerbung_${lastName}_${company}.pdf`;
  triggerDownload(blob, fileName);
}
