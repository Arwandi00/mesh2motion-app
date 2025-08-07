export class ThemeManager extends EventTarget {
  private current_theme: 'light' | 'dark' = 'dark'
  private theme_toggle_button: HTMLButtonElement | null = null
  private theme_icon: HTMLElement | null = null

  private theme_change_event: CustomEvent | null = null

  constructor () {
    super()
    this.initialize()
  }

  private initialize (): void {
    // Get DOM elements
    this.theme_toggle_button = document.querySelector('#theme-toggle')
    this.theme_icon = this.theme_toggle_button?.querySelector('.theme-icon') ?? null

    // Load saved theme preference
    this.load_theme_preference()

    // Set up event listener
    this.theme_toggle_button?.addEventListener('click', () => {
      this.toggle_theme()
    })

    // Apply initial theme
    this.apply_theme()
  }

  private load_theme_preference (): void {
    const saved_theme = localStorage.getItem('mesh2motion-theme')
    if (saved_theme === 'light' || saved_theme === 'dark') {
      this.current_theme = saved_theme
    } else {
      // Default to dark theme
      this.current_theme = 'dark'
    }
  }

  private save_theme_preference (): void {
    localStorage.setItem('mesh2motion-theme', this.current_theme)
  }

  private apply_theme (): void {
    const html_element = document.documentElement

    if (this.current_theme === 'light') {
      html_element.setAttribute('data-theme', 'light')
    } else {
      html_element.removeAttribute('data-theme')
    }

    this.update_toggle_ui()
  }

  private update_toggle_ui (): void {
    if (this.theme_icon !== null) {
      if (this.current_theme === 'light') {
        this.theme_icon.textContent = '😎'
      } else {
        this.theme_icon.textContent = '🌝'
      }
    }
  }

  public toggle_theme (): void {
    this.current_theme = this.current_theme === 'light' ? 'dark' : 'light'
    this.apply_theme()
    this.save_theme_preference()

    // emit an event to notify other parts of the application
    this.theme_change_event = new CustomEvent('theme-changed', { detail: { theme: this.current_theme } })
    this.dispatchEvent(this.theme_change_event)
  }

  public get_current_theme (): 'light' | 'dark' {
    return this.current_theme
  }

  public set_theme (theme: 'light' | 'dark'): void {
    this.current_theme = theme
    this.apply_theme()
    this.save_theme_preference()
  }
}
