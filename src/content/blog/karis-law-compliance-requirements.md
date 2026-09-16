---
title: "Kari's Law Compliance Requirements for Multi-Line Systems"
date: "2026-09-16"
category: "Compliance & Regulation"
description: "Kari's Law compliance requirements for multi-line phone systems: direct 911 dialing, on-site notification, and dispatchable location deadlines for your site."
author: "Carter Dewey"
readTime: "6 min read"
image: "/blog-images/karis-law-compliance-requirements.png"
---

Kari's Law compliance requirements come down to three things a multi-line telephone system has to do: let anyone dial 911 from any station with no prefix, access code, or "9" in front of it; notify someone at the facility when a 911 call is placed; and deliver the caller's dispatchable location to the 911 center. The first two come from the Kari's Law Act of 2017, the location requirement comes from section 506 of RAY BAUM'S Act, and all three are written into the FCC's rules at [47 CFR § 9.16](https://www.ecfr.gov/current/title-47/section-9.16).

## What Kari's Law Requires of a Multi-Line Phone System

The rule is written as a prohibition, not a feature list: a system may not be sold, leased, installed or operated unless a user can "directly initiate a call to 911 from any station equipped with dialing facilities, without dialing any additional digit, code, prefix, or post-fix, including any trunk-access code such as the digit 9" ([47 CFR § 9.16(b)(1)](https://www.ecfr.gov/current/title-47/section-9.16)). The clause that catches people is the qualifier — this holds "regardless of whether the user is required to dial such a digit, code, prefix, or post-fix for other calls." An outside line still needs a 9 for every other call. It must not need one for 911.

Notification is the second duty: the system has to be configured to notify a central location at the facility, or another person or organization, "if the system is able to be configured to provide the notification without an improvement to the hardware or software of the system" ([47 CFR § 9.16(b)(2)](https://www.ecfr.gov/current/title-47/section-9.16)). Where that is possible, the rule sets three conditions — the notification must be initiated contemporaneously with the 911 call when technically feasible, it must not delay the call, and it must go somewhere a person is likely to see or hear it, like a front desk or a security console rather than an inbox nobody reads.

The Act applies to systems first sold, leased, or installed more than two years after it was signed on February 16, 2018 ([Pub. L. 115-127](https://www.govinfo.gov/content/pkg/PLAW-115publ127/html/PLAW-115publ127.htm)). Its words are "any station equipped with dialing facilities," so what matters is not how many phones a building has but whether someone standing at one can dial.

## What RAY BAUM'S Act Adds: Dispatchable Location

Direct dialing gets a 911 call to the 911 center. It does not, on its own, tell the responding crew where inside the building to go. Section 506 of RAY BAUM'S Act supplies that half, defining "dispatchable location" as "the street address of the calling party, and additional information such as room number, floor number, or similar information necessary to adequately identify the location of the calling party" ([84 FR 66716](https://www.federalregister.gov/documents/2019/12/05/2019-20137/implementing-karis-law-and-ray-baums-act-inquiry-concerning-911-access-routing-and-location-in)). The FCC's own definition tightens it further, requiring the validated street address plus suite, apartment or similar detail ([47 CFR § 9.3](https://www.ecfr.gov/current/title-47/section-9.3)). The distinction is granularity: which building to enter, and where inside that building the caller is.

## The Deadlines That Apply to Your System

The rule set three deadlines by device type, and all three have passed ([47 CFR § 9.16(b)(3)](https://www.ecfr.gov/current/title-47/section-9.16)):

- **On-premises fixed telephones** — automated dispatchable location no later than **January 6, 2021**.
- **On-premises non-fixed devices** — cordless handsets, softphones, laptops attached to the system — no later than **January 6, 2022**, where automated location is technically feasible; otherwise the rule allows location based on an end user manual update or alternative location information as defined in § 9.3.
- **Off-premises devices** — no later than **January 6, 2022**, automatic where technically feasible; otherwise manual update or enhanced, coordinate-based location information.

Because the dates are behind us, there is no upgrade window left to plan around; the question for a system in service today is whether it meets them, and how you would show that.

## Who Is Responsible: The Vendor or the Operator

The rule splits the duty by who touches the system. Manufacturers, importers, sellers and lessors may not make, import, sell or lease a system that is not pre-configured for direct 911 dialing and lacks the capability to provide the caller's dispatchable location ([47 CFR § 9.16(a)](https://www.ecfr.gov/current/title-47/section-9.16)). Installers, managers and operators carry the mirror obligations: the system they run must be configured for direct dial, must send MLTS notification where that is possible, and must convey dispatchable location with the call ([47 CFR § 9.16(b)](https://www.ecfr.gov/current/title-47/section-9.16)).

That split matters when something is wrong. If a system cannot pass location at all, the capability question lands on the party that supplied it. If a 9-prefix is restored during a trunk change, that is an operating failure, not a capability gap.

Where these duties sit matters: the dialing, notification and location obligations run through the voice network that carries the call, which for our customers is the MIX Networks voice network; device certifications belong to the device manufacturer; and the design, configuration and operation of the system on site is TrustedNetworx's work. None of the three substitutes for the others, and none is a label you apply once — a configuration is something you check and re-check after every change.

## How to Prove It Works, and Where Migrations Break It

Testing is what turns a configuration into evidence:

- Place a test 911 call from a station that normally needs an access code — coordinated in advance with the local PSAP — and confirm it connected without the prefix.
- Confirm the notification arrived where a person was, and note how long it took.
- Ask the call taker what location appeared on their screen and compare it to the room the call came from, then repeat from a non-fixed device, where location may depend on a manual update rather than an automatic lookup.
- Record the date, station, result and correction. A test you can produce a year later beats a screenshot of a settings page.

Migrations are where these settings quietly come apart. A new platform or a re-cut trunk can restore the trunk-access prefix the rule forbids, and a rebuilt dial plan can drop the mapping that tied each station to a floor and a room. Location data is per-building and per-station work, and for non-fixed devices the rule may lean on a manual update that only happens if someone owns the task ([the migration mistakes that cost businesses the most](/blog/migrating-to-voip-what-business-leaders-get-wrong)).

The cleanest way to catch it is to fold the 911 checks into the compliance review you already run ([the compliance audit checklist facility managers use](/blog/compliance-audit-checklist-facility-manager)).

---

The requirements are short: dial straight out, notify someone who is there, and send a location a responder can walk to. Making that true at every station — and keeping it true after the next change — is a configuration and testing job. [See how we design and manage voice for multi-site organizations](/voice-solutions), or [tell us what your phone system looks like today](/contact) and we will tell you what has to change before the next inspection.
