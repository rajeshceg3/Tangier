from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the local preview URL
        page.goto("http://localhost:4173")

        # Wait for the initial overlay to fade (Light Gathering duration is 2s)
        page.wait_for_timeout(3000)

        # Take a screenshot of the top (Horizon)
        page.screenshot(path="verification_top.png")

        # Scroll down to reveal Medina layers and text
        page.evaluate("window.scrollTo(0, 1000)")
        page.wait_for_timeout(1000) # Wait for potential scroll interactions

        # Take a screenshot of the Medina section
        page.screenshot(path="verification_medina.png")

        browser.close()

if __name__ == "__main__":
    verify_app()
