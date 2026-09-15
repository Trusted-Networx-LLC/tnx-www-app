---
title: "AI Call Recording Consent Requirements: Who Must Agree"
date: "2026-09-15"
category: "AI for Business"
description: "AI call recording consent requirements: when every party on the line must agree, what the agent has to announce before it records, and how to log consent."
author: "Carter Dewey"
readTime: "6 min read"
image: "/blog-images/ai-call-recording-consent-requirements.png"
---

An AI agent that records or transcribes a call is recording a conversation between people, so the consent rules that govern call recording govern the agent. Federal law permits the recording with one party's consent; California, Massachusetts, Washington and Illinois are among the states that require the agreement of every party instead. Because these rules attach to the people on the call rather than to your office, the working standard is the strictest state represented on the line.

## What an AI Agent on a Call Actually Triggers

The federal wiretap statute makes intercepting a call's contents unlawful unless a party to the call has given prior consent, with one exception: consent does not protect an interception made for a criminal or tortious purpose ([18 U.S.C. § 2511](https://www.govinfo.gov/content/pkg/USCODE-2023-title18/html/USCODE-2023-title18-partI-chap119-sec2511.htm)). A disclosure at the top of the call is what creates that consent for most business calls.

Transcription is not a way around the rule. An agent that keeps no audio still captures the conversation's contents, and at least one state code names transcription separately from recording: Illinois makes it eavesdropping to "record, or transcribe" a private electronic communication without the consent of all parties ([720 ILCS 5/14-2](https://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=072000050K14-2)).

Where states require more than the federal floor, they say so in their own text:

- **California** makes it unlawful to record a confidential communication "without the consent of all parties to a confidential communication" ([Cal. Penal Code § 632](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=632)).
- **Massachusetts** requires "prior authority by all parties to such communication" ([M.G.L. c. 272 § 99](https://malegislature.gov/Laws/GeneralLaws/PartIV/TitleI/Chapter272/Section99)).
- **Washington** requires "the consent of all the participants" before recording a private communication transmitted by telephone ([RCW 9.73.030](https://app.leg.wa.gov/RCW/default.aspx?cite=9.73.030)).
- **Illinois** requires the consent of all other parties when a party to the private conversation records it ([720 ILCS 5/14-2](https://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=072000050K14-2)).

Those four are not the whole map, and the map is not the point. What matters is reach: Washington's statute is written to cover private communications "between points within or without the state," so the rule that applies is not decided by where the agent runs. The operating standard we use is the strictest rule represented on the call — check the code in each state where a participant sits, then design to the tightest one.

## What the Agent Has to Say Before It Records

Washington shows what a notice has to do. Where all-party consent is needed, consent "shall be considered obtained" once one party has announced to all the others, in any reasonably effective manner, that the conversation is about to be recorded — and if the conversation is recorded, the announcement has to be recorded too ([RCW 9.73.030(3)](https://app.leg.wa.gov/RCW/default.aspx?cite=9.73.030)). Two design consequences follow: the notice is delivered before the conversation starts, and it lives inside the recording rather than in a policy document nobody on the call can see.

In a state that asks for consent rather than for notice, the announcement is how you ask — not the answer. Whether staying on the line counts as agreement is a question for counsel in that state, which is why the decline path matters as much as the script.

Write the notice to describe the whole stack in one breath: the call is recorded, it is transcribed, an AI system processes the transcript, where the record is stored, how long it is kept, and what happens if the caller would rather not. A recording disclosure on its own leaves the transcription and the model unexplained, and those are the parts a caller has no way to infer.

## The Evidence to Keep Per Call

Consent you cannot produce is consent you cannot rely on. The record that holds up is specific to the call: the notice text and the script version that delivered it, when the announcement was made, which party agreed and which declined, the recording that contains the announcement itself, and the retention decision that applied to it. If transcripts flow into your CRM, keep the consent flag beside the transcript rather than in a separate spreadsheet, so the two travel together when someone reviews a call months later ([how AI call summaries land in the CRM](/blog/ai-call-summary-crm)).

## What to Do When a Caller Declines

A decline path is part of the call flow, not an exception handler bolted onto it. Decide in advance whether the agent continues without recording, transfers to a person on an extension that is not recorded, or ends the call without a transcript, and have the agent say which of those applies at the moment it asks. Then make the stop deterministic — when a caller declines, the agent should stop capturing, not finish the sentence first.

Write the answer down where your team can find it, so the second caller who declines gets the same response as the first. The rule only holds if it is the same rule every shift ([an AI usage policy your team will follow](/blog/ai-usage-policy-for-employees)).

## Outbound AI Voice Calls Are a Different Question

Not every consent question here is about recording. An agent that dials out is placing a call with an artificial voice, and the FCC addressed that directly in a declaratory ruling released February 8, 2024: the TCPA's restrictions on an "artificial or prerecorded voice" encompass AI technologies that generate human voices, so those calls need the called party's prior express consent absent an emergency purpose or an exemption ([FCC 24-17](https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf)). The consent that covers recording an inbound call is not the consent the TCPA requires for an outbound artificial-voice call — two rules, two consents, and the outbound one belongs in the design before the first dial.

---

The consent rules themselves are short. The work is capturing the right consent on every call and being able to produce it a year later, which is a call-flow decision and not a legal one. If you want the ask designed into the flow instead of retrofitted after a review, [see how we deploy AI for multi-site operators](/ai), and use the [AI readiness assessment](/tools/ai-readiness) to see which of your call flows is ready for an agent today. [Tell us what your call flow looks like](/contact) and we will tell you where the consent ask belongs.
