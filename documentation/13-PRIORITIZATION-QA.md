# SIA Platform — Prioritization Q&A

**Purpose:** Answer these questions to define what gets built first. Answers drive the sprint-1 scope and open-source stack selection.

---

## Q1. Who is "you" right now?

When you say "manage partners" — is it only you (Omar / SIA team) doing this today, or are partners also logging in? Your story map has two very different flows: **ADMIN-01/02** (SIA manages partners) vs **REG-01** (partners self-onboard). Which one ships first? If it's just you internally, we don't need auth, self-service, or org flows yet — we need a CRM.

**Answer:**

I believe I am playing now the admin role, which is in the middle of everyone represented SIA administration. 
---

## Q2. What does "partner" actually mean in your database today?

You have four partner types in REG-01: investor, company, government, startup. Do they all get the same fields? The same MOU template? The same onboarding link? Or are you sending different links to different partner types? This changes the data model fundamentally.

**Answer:**
By partner, I mean all of them. At the end of the day, they are going to have files; they are going to have portfolios; they can have mandates for a business. For example, the company might have a team, projects whatsoever. The government has projects, has points of contact, and all of them have points of contact. They are pretty much almost the same; we can unify them under a generic definition called organization, by the way. 

---

## Q3. "Send them links to add information" — what happens when they don't?

You're building a self-service intake form. What's your fallback when a partner in Riyadh ignores the link for 3 weeks? Do you need reminders? A way to fill it in on their behalf from a PDF they emailed you? Because if partners won't fill forms, you need an "add partner manually" flow first.

**Answer:**
In the very first MVP, we need to have a trigger, a manual trigger, to resend the email or the message or the notification. We also need to have internally a reminder to the admin that there is a list, sort of a dashboard, with a priority part that prioritizes those reaching a specific SLA or OLA. The whole aim of SLA is internally and externally. SLA is the whole purpose together of a group team, and they are all, particularly, a specific department, whether it was internal or external from an organization. We are organizations, and we are organizations. We have the concept of the OLA and SLA are going to be a applied to the post. 


---

## Q4. "Import their files directly" — what files?

Are these commercial registrations, company profiles, pitch decks, financial statements? Are they PDFs, Word docs, spreadsheets? Do you need to extract data from them or just store them? "Consume inside our platform" means very different things for "display a PDF" vs "parse a company profile into structured fields."

**Answer:**
All the documents might be of all types of PDF, DOCX, Spreadsheets, and the PowerPoint as well. Regarding the extraction, we are not going to do it in MVP, but we are going to do it with a parser. 

---

## Q5. MNDAs, MOUs, Letters of Intent — are these your templates or theirs?

Do you have standard SIA templates for these documents that get variable-filled (partner name, date, scope) and sent? Or does each deal have a custom document? If templates: how many do you have right now, in what format (Word? PDF? Google Doc?)?

**Answer:**
There might be an issue in alignment between both of us when we speak about documents, attachments, or organizational documents. We are speaking about docs that need to be signed and docs that are just revised. Every document could be signed, but we are asking a controversial question: we're asking about templates. I'm not sure whether you got me or not. We need something like a DocuSign or Zoho signature or Dropbox signature for an open source project so that we can sign any type of document and we can put the signature at any place in the document; it doesn't matter. By the way, the signature module is one of the highest priority modules you need to have. If you have a Brainy Mate to do that, it's going to be great! 

---

## Q6. "Send to their emails" — what's the actual signing flow?

Is it: partner receives email > clicks link > views document > draws/types signature > done? Or is it: partner receives email > downloads PDF > signs physically > scans > uploads back? Because the first is a DocuSign replacement (significant build). The second is just email + file upload.

**Answer:**
The very first option, which is they sign the document online by drawing or typing using the keyboard, not doing the signature physically. They also can upload their physical signature and use it every time. And we might have the two options that are signed by hand, but not at the moment. 

---

## Q7. Address book — is this a flat list or a graph?

A partner can have multiple contacts (CEO, legal counsel, technical lead). A contact can belong to multiple organizations. An organization can be involved in multiple deals. Are you building a contact list or a relationship graph? Your story map has ORG-01 through ORG-06 suggesting multi-member organizations.

**Answer:**
It is a multi-member organization, and we can relate a single user to multiple organizations.

---

## Q8. What's in Mujarrad today?

Is Mujarrad deployed? Does it have an API? A schema? Or is it still conceptual? Every story in your map says "saved to Mujarrad" — but if there's no backend yet, we're building a frontend that talks to nothing. What's the actual state of the backend?

**Answer:**
Yes, it has an API schema, and I'm gonna show you the swagger of it: https://mujarrad.onrender.com/swagger-ui/index.html

---

## Q9. What are you using TODAY to manage partners?

Excel? Google Sheets? A WhatsApp group? Notion? Your answer tells me what the MVP needs to replace — not what the PRD imagines. If you're managing 5 partners in a spreadsheet, you don't need a CRM with Kanban and health scores. You need a better spreadsheet.

**Answer:**

I'm not using any bank, and it's a nightmare. I find everywhere on WhatsApp or on the web, on email its a nightmare. 
---

## Q10. What's your "internally cut operations cost" metric?

You said product-led to cut ops cost. What specifically takes you the most time today? Chasing partners for documents? Manually drafting MOUs? Tracking who signed what? The answer determines what we build in week 1 vs week 4.

**Answer:**
Actually, I'm not a chaser, and I'm behind the chat work of arranging meetings with them, on connecting information, and prioritizing the tasks of moving their files and managing the SLA or achieving the expectations out of the relationship. I'm making this relationship actually nurture it and take it to the next level, and to make it actually work inside that network. We are not actually doing this; I'm losing too much information, and I'm afraid that without a system we cannot do this, partially automated or even manually, because it is simply not feasible to hire people to send all the information everywhere.

The decision of the match, the matching, has to be guided by the decision makers and the Board, but the decisions and the operations and the day-to-day ones have to be moved through an organized technology that gathers all the aspects together, as what actually Mujarrad flourishes in. 



