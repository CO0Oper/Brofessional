# Plainly

## Product

Plainly is a web chat for people who want to move between direct thoughts and polished, professional LinkedIn language without losing the original meaning.

## Audience

Professionals writing posts, replies, and workplace messages who want a fast translation between plain speech and LinkedIn-style phrasing.

## Core task

The user can turn auto-detected natural language into concise LinkedIn-style English, or decode LinkedIn Speak with either a plain translation in a chosen language or a blunt, humorous English interpretation. They can copy, refine, and revisit paired translations in a collapsed history.

## Platform

Web. The static client is hosted on GitHub Pages. A Cloudflare Worker keeps the OpenRouter credential server-side.

## Model

`deepseek/deepseek-chat-v3.1` through OpenRouter.

## Constraints

- The OpenRouter API key must never be committed or shipped to the browser.
- The public interface must work on desktop and mobile and meet basic accessibility expectations.
- Visual styling uses LinkedIn's blue and neutral palette without implying affiliation.

## Brand commitments

The interface borrows the attached reference's two-panel translator rhythm, generous black framing, direct humor, and practical copy-first interaction.
