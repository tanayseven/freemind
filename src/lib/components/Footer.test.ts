import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/svelte"
import Footer from "$lib/components/Footer.svelte"

describe("Footer.svelte", () => {
  it("renders with created with love and sweat by Tanay", () => {
    render(Footer)
    const footer = screen.getByTestId("created-by-tanay")

    const expectedTexts = ["Made with", "❤️", "and", "😓", "by", "Tanay"]

    expectedTexts.forEach((text) => {
      expect(footer.textContent).toContain(text)
    })
  })
})
