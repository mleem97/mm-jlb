import ReactPDF from "@react-pdf/renderer";

import type { ApplicationState, PersonalData } from "@/types/application";
import type { LayoutConfig } from "@/types/layoutConfig";
import type { CoverLetter, CoverLetterMeta } from "@/types/coverLetter";
import type { JobPosting } from "@/types/jobPosting";
import { triggerDownload } from "@/lib/export/jsonExport";
import { addPdfMetadata } from "@/lib/export/pdfPostProcess";

const { Document, Page, Text, View, Image, Link, StyleSheet, pdf } = ReactPDF;

// ─── Font Mapping ──────────────────────────────────────────
const FONT_MAP: Record<string, { regular: string; bold: string }> = {
  Inter: { regular: "Helvetica", bold: "Helvetica-Bold" },
  Roboto: { regular: "Helvetica", bold: "Helvetica-Bold" },
  "Open Sans": { regular: "Helvetica", bold: "Helvetica-Bold" },
  Lato: { regular: "Helvetica", bold: "Helvetica-Bold" },
  Merriweather: { regular: "Times-Roman", bold: "Times-Bold" },
};

function getFont(fontFamily: string) {
  return FONT_MAP[fontFamily] ?? FONT_MAP.Inter;
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

const coverPageStyles = StyleSheet.create({
  page: { padding: 60, fontFamily: "Helvetica" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    objectFit: "cover",
    marginBottom: 24,
  },
  title: { fontSize: 30, marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#4a5568", marginBottom: 30 },
  line: { width: 60, height: 2, marginBottom: 30 },
  name: { fontSize: 14, marginBottom: 4 },
  detail: {
    fontSize: 11,
    color: "#4a5568",
    marginBottom: 3,
    textAlign: "center",
  },
});

function CoverPageSection({ personalData, jobPosting, layout }: CoverPageProps) {
  const font = getFont(layout.fontFamily);
  const fullName = `${personalData.firstName} ${personalData.lastName}`;
  return (
    <Page
      size="A4"
      style={{ ...coverPageStyles.page, fontFamily: font.regular }}
    >
      <View style={coverPageStyles.center}>
        {personalData.photo && (
          <Image src={personalData.photo} style={coverPageStyles.photo} />
        )}
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
          <Text style={coverPageStyles.subtitle}>
            als {jobPosting.jobTitle}
          </Text>
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
        {personalData.email && (
          <Text style={coverPageStyles.detail}>{personalData.email}</Text>
        )}
        {personalData.phone && (
          <Text style={coverPageStyles.detail}>{personalData.phone}</Text>
        )}
        {(personalData.address.street || personalData.address.city) && (
          <Text style={coverPageStyles.detail}>
            {[
              personalData.address.street,
              `${personalData.address.zip} ${personalData.address.city}`,
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>
        )}
        {jobPosting?.companyName && (
          <Text style={{ ...coverPageStyles.detail, marginTop: 20 }}>
            bei {jobPosting.companyName}
          </Text>
        )}
      </View>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════
//  COVER LETTER (shared across all templates)
// ═══════════════════════════════════════════════════════════

const clStyles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
  },
  sender: { marginBottom: 28, fontSize: 10, lineHeight: 1.5 },
  recipient: { marginBottom: 20, fontSize: 10, lineHeight: 1.5 },
  date: {
    textAlign: "right",
    fontSize: 10,
    color: "#4a5568",
    marginBottom: 24,
  },
  subject: { fontSize: 12, marginBottom: 18 },
  body: {
    fontSize: 11,
    lineHeight: 1.7,
    marginBottom: 8,
    textAlign: "justify",
  },
  signature: { marginTop: 36, fontSize: 11 },
  attachments: { marginTop: 36, fontSize: 9, color: "#718096" },
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
    ? `Bewerbung als ${jobPosting.jobTitle}`
    : "Bewerbung";

  return (
    <Page
      size="A4"
      style={{ ...clStyles.page, fontFamily: font.regular }}
    >
      {/* Sender */}
      <View style={clStyles.sender}>
        <Text style={{ fontFamily: font.bold }}>{fullName}</Text>
        {personalData.address.street && (
          <Text>{personalData.address.street}</Text>
        )}
        {(personalData.address.zip || personalData.address.city) && (
          <Text>
            {personalData.address.zip} {personalData.address.city}
          </Text>
        )}
        {personalData.email && <Text>{personalData.email}</Text>}
        {personalData.phone && <Text>{personalData.phone}</Text>}
      </View>

      {/* Recipient */}
      {jobPosting && (
        <View style={clStyles.recipient}>
          {jobPosting.companyName && (
            <Text style={{ fontFamily: font.bold }}>
              {jobPosting.companyName}
            </Text>
          )}
          {jobPosting.contactPerson && (
            <Text>{jobPosting.contactPerson}</Text>
          )}
          {jobPosting.companyAddress?.street && (
            <Text>{jobPosting.companyAddress.street}</Text>
          )}
          {(jobPosting.companyAddress?.zip ||
            jobPosting.companyAddress?.city) && (
            <Text>
              {jobPosting.companyAddress?.zip}{" "}
              {jobPosting.companyAddress?.city}
            </Text>
          )}
        </View>
      )}

      {/* Date */}
      <Text style={clStyles.date}>
        {personalData.address.city
          ? `${personalData.address.city}, `
          : ""}
        {today}
      </Text>

      {/* Subject */}
      <Text style={{ ...clStyles.subject, fontFamily: font.bold }}>
        {subject}
      </Text>

      {/* Salutation */}
      <Text style={clStyles.body}>
        {jobPosting?.contactPerson
          ? `Sehr geehrte/r ${jobPosting.contactPerson},`
          : "Sehr geehrte Damen und Herren,"}
      </Text>

      {/* Body */}
      {letterText
        .split("\n")
        .filter(Boolean)
        .map((p, i) => (
          <Text key={`cl-p-${i}`} style={clStyles.body}>
            {p}
          </Text>
        ))}

      {/* Signature */}
      <View style={clStyles.signature}>
        <Text>Mit freundlichen Grüßen</Text>
        <Text style={{ marginTop: 24, fontFamily: font.bold }}>
          {fullName}
        </Text>
      </View>

      {/* Attachments */}
      <View style={clStyles.attachments}>
        <Text>Anlagen: Lebenslauf</Text>
        {coverLetterMeta?.entryDate && (
          <Text>
            Frühester Eintrittstermin: {coverLetterMeta.entryDate}
          </Text>
        )}
        {coverLetterMeta?.salaryExpectation && (
          <Text>
            Gehaltsvorstellung: {coverLetterMeta.salaryExpectation}
          </Text>
        )}
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
      padding: 40,
      fontFamily: font.regular,
      fontSize: fs,
      lineHeight: 1.5,
      color: "#1a202c",
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

  return (
    <Page size="A4" style={s.page} wrap>
      {/* Header */}
      <View style={isCenter ? s.headerCenter : s.header}>
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
      lineHeight: 1.5,
      color: "#1a202c",
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
      padding: "24 40 20 46",
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
    body: { padding: "16 40 30 46" },
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

  return (
    <Page size="A4" style={s.page} wrap>
      {/* Accent Bar */}
      <View style={s.accentBar} fixed />

      {/* Colored Header */}
      <View style={s.headerBg}>
        <View style={s.headerInfo}>
          <Text style={s.name}>
            {personalData.firstName} {personalData.lastName}
          </Text>
          {state.jobPosting?.jobTitle && (
            <Text style={s.headerSub}>
              {state.jobPosting.jobTitle}
            </Text>
          )}
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
        </View>
        {showPhoto && (
          <Image src={personalData.photo!} style={s.photo} />
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

  const s = StyleSheet.create({
    page: {
      fontFamily: font.regular,
      fontSize: fs,
      lineHeight: 1.45,
      color: "#1a202c",
    },
    wrapper: { flexDirection: "row", minHeight: "100%" },
    // ── Sidebar ──
    sidebar: {
      width: 170,
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
    main: { flex: 1, padding: "30 30 30 24" },
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
        <View style={s.sidebar} fixed>
          {showPhoto && (
            <Image
              src={personalData.photo!}
              style={s.sidebarPhoto}
            />
          )}
          <Text style={s.sidebarName}>
            {personalData.firstName} {personalData.lastName}
          </Text>
          {state.jobPosting?.jobTitle && (
            <Text style={s.sidebarTitle}>
              {state.jobPosting.jobTitle}
            </Text>
          )}

          {/* Contact */}
          <Text style={s.sidebarSectionTitle}>Kontakt</Text>
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
              <Text style={s.sidebarSectionTitle}>Kenntnisse</Text>
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
              <Text style={s.sidebarSectionTitle}>Sprachen</Text>
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
//  TEMPLATE ROUTER — picks the right CV template
// ═══════════════════════════════════════════════════════════

function CVTemplateRouter(props: CVProps) {
  switch (props.layout.templateId) {
    case "modern":
      return <ModernCV {...props} />;
    case "creative":
      return <CreativeCV {...props} />;
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
