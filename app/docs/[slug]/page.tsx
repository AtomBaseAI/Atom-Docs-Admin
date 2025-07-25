
"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, useCallback } from "react"
import { notFound, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react"
import * as LucideIcons from "lucide-react"
import Link from "next/link"
import type { Page } from "@/types"
import { fetchData } from "@/lib/api"

interface PageProps {
  params: { slug: string }
}

// Animation variants for page transitions
const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  in: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  out: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
}

// Content animation variants
const contentVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
}

const contentTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
}

// Helper function to get SVG path for icons
const getIconSvgPath = (iconName: string) => {
  const iconPaths: Record<string, string> = {
    TriangleAlert:
      '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/>',
    BarChart2:
      '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    Book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    Brain:
      '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>',
    ChartBarBig:
      '<path d="M3 3v18h18"/><rect width="4" height="7" x="7" y="10" rx="1"/><rect width="4" height="12" x="15" y="5" rx="1"/>',
    Check: '<path d="M20 6 9 17l-5-5"/>',
    SquareCheckBig: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    ChevronLeft: '<path d="m15 18-6-6 6-6"/>',
    ChevronRight: '<path d="m9 18 6-6-6-6"/>',
    CirclePlus: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    CircleCheckBig: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    Code: '<polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>',
    Code2: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    DownloadCloud:
      '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/>',
    Eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    FileVideo:
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m10 15.5 4-2.5-4-2.5v5z"/>',
    FileDown:
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>',
    FlaskConical:
      '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    Hexagon:
      '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
    Image:
      '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    Key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
    Layers:
      '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    Laptop:
      '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
    Linkedin:
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    Lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    LogOut:
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    LayoutDashboard:
      '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    Maximize:
      '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    Minimize:
      '<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>',
    Moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    Settings:
      '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    Settings2: '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
    Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    Package:
      '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    Pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    PieChart: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="m22 12A10 10 0 0 0 12 2v10z"/>',
    Play: '<polygon points="5,3 19,12 5,21"/>',
    Plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    Power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
    Puzzle:
      '<path d="M19.439 7.85c-.049.322-.059.648-.026.975.056.506.194.958.5 1.335.34.389.85.594 1.348.594.492 0 .98-.218 1.294-.687.154-.23.239-.497.239-.776 0-.408-.155-.796-.43-1.084-.275-.29-.634-.459-1.018-.459-.369 0-.714.178-.934.467-.16.211-.252.469-.252.735 0 .199.044.393.117.573"/>',
    ShieldCheck:
      '<path d="M20 13c0 5-3.5 7.5-8 7.5S4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    ShipWheel:
      '<circle cx="12" cy="12" r="8"/><path d="m12 2 3 10-3-1-3 1Z"/><path d="M12 22V12"/><path d="m17 20.5-5-8 5-3 5 8Z"/><path d="M2 12h10"/><path d="M22 12h-10"/><path d="m7 3.5 5 8-5 3-5-8Z"/>',
    Star: '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>',
    Scroll:
      '<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v11a2 2 0 0 0 2 2z"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/>',
    Terminal: '<polyline points="4,17 10,11 4,5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    Trash:
      '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2"/>',
    Trophy:
      '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20 14 20s1.96-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34c0-1.92-1.56-3.48-3.48-3.48H10.48C8.56 11.18 7 12.74 7 14.66Z"/>',
    UploadCloud:
      '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>',
    Users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3.5-3.5a4 4 0 0 0-7 0L8 21"/>',
  }
  return iconPaths[iconName] || '<circle cx="12" cy="12" r="2"/>'
}

// Helper function to resolve theme-based colors with improved default handling
const resolveColor = (
  colorValue: string,
  colorType: "background" | "text" | "border",
  isDark: boolean,
  allDefault: boolean,
) => {
  if (colorValue === "default") {
    if (allDefault) {
      // When all colors are default, use opposite colors based on theme
      if (isDark) {
        // Dark theme: dark background, light text/border
        if (colorType === "background") return "#000000" // Dark background
        if (colorType === "text") return "#ffffff" // Light text
        if (colorType === "border") return "#ffffff" // Light border
      } else {
        // Light theme: light background, dark text/border
        if (colorType === "background") return "#ffffff" // Light background
        if (colorType === "text") return "#000000" // Dark text
        if (colorType === "border") return "#000000" // Dark border
      }
    } else {
      // Individual default handling based on theme
      if (colorType === "background") return "#3b82f6"
      if (colorType === "text") return isDark ? "#ffffff" : "#000000"
      if (colorType === "border") return "#3b82f6"
    }
  }
  return colorValue
}

const renderContentWithIcons = (content: string) => {
  // Detect if we're in dark mode by checking if the document has the 'dark' class
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark")

  // Handle button rendering with proper icons and dynamic sizing
  return content.replace(/<span[^>]*data-button="true"[^>]*>(.*?)<\/span>/g, (match, innerContent) => {
    // Extract attributes from the span
    const textMatch = match.match(/data-text="([^"]*)"/)
    const iconMatch = match.match(/data-icon="([^"]*)"/)
    const iconColorMatch = match.match(/data-icon-color="([^"]*)"/)
    const buttonTypeMatch = match.match(/data-button-type="([^"]*)"/)
    const bgColorMatch = match.match(/data-bg-color="([^"]*)"/)
    const textColorMatch = match.match(/data-text-color="([^"]*)"/)
    const borderColorMatch = match.match(/data-border-color="([^"]*)"/)
    const hasBorderMatch = match.match(/data-has-border="([^"]*)"/)
    const widthMatch = match.match(/data-width="([^"]*)"/)
    const heightMatch = match.match(/data-height="([^"]*)"/)
    const hasShadowMatch = match.match(/data-has-shadow="([^"]*)"/)

    const text = textMatch ? textMatch[1] : ""
    const icon = iconMatch ? iconMatch[1] : null
    const iconColor = iconColorMatch ? iconColorMatch[1] : null
    const buttonType = buttonTypeMatch ? buttonTypeMatch[1] : "filled"
    const backgroundColor = bgColorMatch ? bgColorMatch[1] : "default"
    const textColor = textColorMatch ? textColorMatch[1] : "default"
    const borderColor = borderColorMatch ? borderColorMatch[1] : "default"
    const hasBorder = hasBorderMatch ? hasBorderMatch[1] === "true" : true
    const width = widthMatch ? widthMatch[1] : "120"
    const height = heightMatch ? heightMatch[1] : "40"
    const hasShadow = hasShadowMatch ? hasShadowMatch[1] === "true" : true

    const isOutline = buttonType === "outline"

    // Check if all colors are default for special handling
    const allDefault = backgroundColor === "default" && textColor === "default" && borderColor === "default"

    // Resolve colors based on theme and default status
    const resolvedBgColor = resolveColor(backgroundColor, "background", isDark, allDefault)
    const resolvedTextColor = resolveColor(textColor, "text", isDark, allDefault)
    const resolvedBorderColor = resolveColor(borderColor, "border", isDark, allDefault)
    const resolvedIconColor = resolveColor(
      iconColor || (isOutline ? borderColor : textColor),
      "text",
      isDark,
      allDefault,
    )

    const bgColor = isOutline ? "transparent" : resolvedBgColor
    const finalTextColor = isOutline ? resolvedBorderColor : resolvedTextColor
    const border = hasBorder ? `2px solid ${resolvedBorderColor}` : "none"
    const shadow = hasShadow
      ? `0 4px 6px -1px ${resolvedBorderColor}40, 0 2px 4px -1px ${resolvedBorderColor}20`
      : "none"

    // Calculate font size and icon size based on button height - increased icon size multiplier
    const buttonHeight = Number.parseInt(height)
    const fontSize = Math.max(10, Math.min(18, buttonHeight * 0.35))
    const iconSize = Math.max(16, Math.min(28, buttonHeight * 0.55)) // Increased from 0.4 to 0.55

    // Create icon SVG if icon exists - using stroke-width 3 for bolder icons
    const iconSvg =
      icon && icon !== "null"
        ? `
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${resolvedIconColor}" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style="margin-right: ${text ? "0.5rem" : "0"}; flex-shrink: 0;">
        ${getIconSvgPath(icon)}
      </svg>
    `
        : ""

    // Determine what to display
    let displayContent = ""
    if (iconSvg) {
      displayContent += iconSvg
    }
    if (text && text.trim()) {
      displayContent += text
    }
    if (!displayContent) {
      displayContent = "Button"
    }

    return `
      <span 
        class="custom-button"
        style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background-color: ${bgColor};
          color: ${finalTextColor};
          border: ${border};
          box-shadow: ${shadow};
          width: ${width}px;
          height: ${height}px;
          margin: 0.25rem 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: ${fontSize}px;
        "
      >
        <span style="display: flex; align-items: center; justify-content: center; width: 100%;">
          ${displayContent}
        </span>
      </span>
    `
  })
}

export default function DocPage({ params }: PageProps) {
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [navigationData, setNavigationData] = useState<{
    prevPage: Page | null
    nextPage: Page | null
  }>({ prevPage: null, nextPage: null })

  const loadData = useCallback(async () => {
    try {
      const data = await fetchData()
      const foundPage = data.pages.find((p) => p.slug === params.slug)

      if (!foundPage) {
        notFound()
      }

      setPage(foundPage)
    } catch (error) {
      console.error("Error loading data:", error)
      notFound()
    } finally {
      setLoading(false)
    }
  }, [params.slug])

  const getNavigationData = useCallback(async () => {
    try {
      const data = await fetchData()
      const allPages = data.pages.sort((a, b) => {
        // First sort by category, then by order within category
        if (a.category !== b.category) {
          const categoryA = data.categories.find((c) => c.slug === a.category)
          const categoryB = data.categories.find((c) => c.slug === b.category)
          const orderA = categoryA?.order ?? 999
          const orderB = categoryB?.order ?? 999
          return orderA - orderB
        }
        return (a.order || 0) - (b.order || 0)
      })

      const currentIndex = allPages.findIndex((p) => p.slug === params.slug)
      const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null
      const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null

      return { prevPage, nextPage }
    } catch (error) {
      console.error("Error loading navigation data:", error)
      return { prevPage: null, nextPage: null }
    }
  }, [params.slug])

  const handleNavigation = useCallback(
    (targetSlug: string, navDirection: number) => {
      setDirection(navDirection)
      setIsNavigating(true)

      // Small delay to allow the exit animation to start
      setTimeout(() => {
        router.push(`/docs/${targetSlug}`)
      }, 50)
    },
    [router],
  )

  const handleSidebarCollapseChange = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }, [])

  useEffect(() => {
    const appState = process.env.NEXT_PUBLIC_APP_STATE
    setIsEditMode(appState === "edit")
    setIsNavigating(false)
    loadData()

    // Load navigation data
    getNavigationData().then(setNavigationData)

    // Load initial sidebar state from localStorage
    const savedCollapseState = localStorage.getItem("sidebar-collapsed")
    setSidebarCollapsed(savedCollapseState === "true")
  }, [loadData, getNavigationData])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isEditMode={isEditMode} />
        <div className="flex">
          <Sidebar isEditMode={isEditMode} onCollapseChange={handleSidebarCollapseChange} />
          <main className={`flex-1 transition-all duration-300 p-6 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-8 bg-muted rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isEditMode={isEditMode} />

      <div className="flex">
        <Sidebar isEditMode={isEditMode} onCollapseChange={handleSidebarCollapseChange} />

        <main
          className={`flex-1 transition-all duration-300 p-6 overflow-hidden ${sidebarCollapsed ? "ml-16" : "ml-64"}`}
        >
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page.id}
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="w-full"
              >
                <motion.div
                  className="my-4"
                  variants={contentVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={{ ...contentTransition, delay: 0.1 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <motion.div
                        className="flex items-center gap-3 mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        {page.icon &&
                          (() => {
                            const IconComponent = (LucideIcons as any)[page.icon]
                            return IconComponent ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
                              >
                                <IconComponent
                                  className="h-8 w-8 text-primary"
                                  style={{ color: page.iconColor || "currentColor" }}
                                />
                              </motion.div>
                            ) : null
                          })()}
                        <h1 className="text-3xl font-bold">{page.title}</h1>
                      </motion.div>
                      <motion.p
                        className="text-lg text-muted-foreground mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.3 }}
                      >
                        {page.description}
                      </motion.p>
                    </div>

                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      {navigationData.prevPage && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNavigation(navigationData.prevPage!.slug, -1)}
                            disabled={isNavigating}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline max-w-32 truncate">{navigationData.prevPage.title}</span>
                            <span className="sm:hidden">Previous</span>
                          </Button>
                        </motion.div>
                      )}

                      {navigationData.nextPage && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNavigation(navigationData.nextPage!.slug, 1)}
                            disabled={isNavigating}
                          >
                            <span className="hidden sm:inline max-w-32 truncate">{navigationData.nextPage.title}</span>
                            <span className="sm:hidden">Next</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </motion.div>
                      )}
                      {isEditMode && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/pages/${page.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  {isEditMode && (
                    <motion.div
                      className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>Category: {page.category}</span>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    {page.tags.map((tag, index) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.05, duration: 0.2 }}
                      >
                        <Badge variant="secondary">{tag}</Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Tabs defaultValue="content" className="w-full">
                    {isEditMode && (
                      <TabsList className={`grid w-full ${isEditMode ? "grid-cols-2" : "grid-cols-1"}`}>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="info">Page Info</TabsTrigger>
                      </TabsList>
                    )}

                    <TabsContent value="content" className="mt-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div
                              className="prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: renderContentWithIcons(page.content),
                              }}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    {isEditMode && (
                      <TabsContent value="info" className="mt-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.3 }}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle>Page Information</CardTitle>
                              <CardDescription>Metadata and details about this page</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                                  <p className="mt-1">{page.title}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Slug</label>
                                  <p className="mt-1 font-mono text-sm">{page.slug}</p>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Description</label>
                                <p className="mt-1">{page.description}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                                  <p className="mt-1">{page.category}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {page.tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                                  <p className="mt-1 text-sm">{new Date(page.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Updated</label>
                                  <p className="mt-1 text-sm">{new Date(page.updatedAt).toLocaleString()}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </TabsContent>
                    )}
                  </Tabs>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
