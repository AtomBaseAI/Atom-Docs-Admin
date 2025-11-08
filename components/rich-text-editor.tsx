"use client"

import { useTheme } from "next-themes"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import { Node } from "@tiptap/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import * as LucideIcons from "lucide-react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  LinkIcon,
  ImageIcon,
  TableIcon,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Trash2,
  Plus,
  Minus,
  Settings,
  SquarePlus,
  Search,
  Maximize,
  Minimize,
} from "lucide-react"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customButton: {
      insertButton: (options: any) => ReturnType
    }
  }
}

// Add button-related constants:
const buttonTypes = [
  { name: "Filled", value: "filled" },
  { name: "Outline", value: "outline" },
]

const ButtonExtension = Node.create({
  name: "customButton",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      text: {
        default: "",
      },
      icon: {
        default: null,
      },
      iconColor: {
        default: null,
      },
      buttonType: {
        default: "filled",
      },
      backgroundColor: {
        default: "#3b82f6",
      },
      textColor: {
        default: "#ffffff",
      },
      borderColor: {
        default: "#3b82f6",
      },
      hasBorder: {
        default: true,
      },
      width: {
        default: "120",
      },
      height: {
        default: "40",
      },
      hasShadow: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "span[data-button]",
        getAttrs: (dom) => {
          const element = dom as HTMLElement
          return {
            text: element.getAttribute("data-text") || "",
            icon: element.getAttribute("data-icon"),
            iconColor: element.getAttribute("data-icon-color"),
            buttonType: element.getAttribute("data-button-type"),
            backgroundColor: element.getAttribute("data-bg-color"),
            textColor: element.getAttribute("data-text-color"),
            borderColor: element.getAttribute("data-border-color"),
            hasBorder: element.getAttribute("data-has-border") === "true",
            width: element.getAttribute("data-width") || "120",
            height: element.getAttribute("data-height") || "40",
            hasShadow: element.getAttribute("data-has-shadow") === "true",
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const {
      text,
      icon,
      iconColor,
      buttonType,
      backgroundColor,
      textColor,
      borderColor,
      hasBorder,
      width,
      height,
      hasShadow,
    } = HTMLAttributes

    const isOutline = buttonType === "outline"
    const bgColor = isOutline ? "transparent" : backgroundColor
    const finalTextColor = isOutline ? borderColor : textColor
    const border = hasBorder ? `2px solid ${borderColor}` : "none"
    const shadow = hasShadow ? `0 4px 6px -1px ${borderColor}40, 0 2px 4px -1px ${borderColor}20` : "none"

    // Calculate font size and icon size based on button height
    const buttonHeight = Number.parseInt(height)
    const fontSize = Math.max(10, Math.min(18, buttonHeight * 0.35)) // Scale font size with height
    const iconSize = Math.max(12, Math.min(24, buttonHeight * 0.4)) // Scale icon size with height

    // Create display text with icon placeholder
    let displayText = ""
    if (icon && icon !== "null") {
      displayText += `[${icon}]`
    }
    if (text && text.trim()) {
      if (displayText) displayText += " "
      displayText += text
    }
    if (!displayText) {
      displayText = "Button"
    }

    return [
      "span",
      {
        "data-button": "true",
        "data-text": text,
        "data-icon": icon,
        "data-icon-color": iconColor,
        "data-button-type": buttonType,
        "data-bg-color": backgroundColor,
        "data-text-color": textColor,
        "data-border-color": borderColor,
        "data-has-border": hasBorder,
        "data-width": width,
        "data-height": height,
        "data-has-shadow": hasShadow,
        style: `
          display: inline-flex;
          align-items: center;
          justify-content: center;
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
        `,
        class: "custom-button",
      },
      displayText,
    ]
  },

  addCommands() {
    return {
      insertButton:
        (options: any) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            })
          },
    }
  },
})

const mostUsefulIcons = [
  "TriangleAlert",
  "Ban",
  "BarChart2",
  "Book",
  "Brain",
  "ChartBarBig",
  "Check",
  "SquareCheckBig",
  "ChevronLeft",
  "ChevronRight",
  "CirclePlus",
  "CircleCheckBig",
  "Code",
  "Code2",
  "DownloadCloud",
  "Eye",
  "FileVideo",
  "FileDown",
  "FlaskConical",
  "Hexagon",
  "Image",
  "Key",
  "Layers",
  "Laptop",
  "Linkedin",
  "Lock",
  "LogOut",
  "LayoutDashboard",
  "LucideBarChartHorizontalBig",
  "Maximize",
  "Minimize",
  "Moon",
  "Settings",
  "Settings2",
  "Sun",
  "Package",
  "Pencil",
  "PieChart",
  "Play",
  "Plus",
  "Power",
  "Puzzle",
  "ShieldCheck",
  "ShipWheel",
  "Star",
  "Scroll",
  "Terminal",
  "Trash",
  "Trophy",
  "UploadCloud",
  "Users",
]

// Aspect ratio presets
const aspectRatios = [
  { name: "Square", value: 1, label: "1:1" },
  { name: "Landscape", value: 1.33, label: "4:3" },
  { name: "Wide", value: 1.78, label: "16:9" },
  { name: "Portrait", value: 0.75, label: "3:4" },
  { name: "Tall", value: 0.56, label: "9:16" },
]

// Width presets with default option
const widthPresets = [
  { name: "Default", value: "default" as const, label: "Default" },
  { name: "Quarter", value: 25, label: "1/4" },
  { name: "Half", value: 50, label: "1/2" },
  { name: "Three Quarter", value: 75, label: "3/4" },
  { name: "Full", value: 100, label: "Full" },
]

// Image alignment options
const imageAlignments = [
  { name: "Left", value: "left", icon: AlignLeft },
  { name: "Center", value: "center", icon: AlignCenter },
  { name: "Right", value: "right", icon: AlignRight },
]

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const { theme } = useTheme()
  const [deleteTableDialog, setDeleteTableDialog] = useState(false)
  const [tableWidth, setTableWidth] = useState([100])
  const [tableHeight, setTableHeight] = useState([200])
  const [buttonPickerOpen, setButtonPickerOpen] = useState(false)
  const [imagePickerOpen, setImagePickerOpen] = useState(false)
  const [imageWidthPercent, setImageWidthPercent] = useState([75]) // Default to 75% width
  const [imageWidthType, setImageWidthType] = useState<"default" | number>("default") // Track if using default or percentage
  const [imageAspectRatio, setImageAspectRatio] = useState([1.33]) // Default to 4:3
  const [imageAlignment, setImageAlignment] = useState("center") // Default to center
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [buttonConfig, setButtonConfig] = useState({
    text: "",
    icon: "",
    iconColor: "#000000",
    buttonType: "filled",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    borderColor: "#3b82f6",
    hasBorder: true,
    width: "120",
    height: "40",
    hasShadow: true,
  })
  const [iconSearchQuery, setIconSearchQuery] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [headingLevel, setHeadingLevel] = useState<string>("paragraph")

  const filteredIcons = useMemo(() => {
    if (!iconSearchQuery.trim()) {
      return mostUsefulIcons
    }

    const query = iconSearchQuery.toLowerCase()
    return mostUsefulIcons.filter(
      (iconName) =>
        iconName.toLowerCase().includes(query) ||
        iconName
          .replace(/([A-Z])/g, " $1")
          .trim()
          .toLowerCase()
          .includes(query),
    )
  }, [iconSearchQuery])

  const colors = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Purple", value: "#7700ff" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#22c55e" },
    { name: "Yellow", value: "#eab308" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Orange", value: "#f97316" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Lime", value: "#84cc16" },
  ]

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "prose-heading",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6 my-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6 my-4",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "",
          },
        },
      }),
      TextStyle,
      Color,
      ButtonExtension,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            src: {
              default: null,
            },
            alt: {
              default: null,
            },
            title: {
              default: null,
            },
            width: {
              default: null,
              parseHTML: (element) => element.getAttribute("width") || element.style.width,
              renderHTML: (attributes) => {
                if (!attributes.width) {
                  return {}
                }
                return {
                  width: attributes.width,
                }
              },
            },
            height: {
              default: null,
              parseHTML: (element) => element.getAttribute("height") || element.style.height,
              renderHTML: (attributes) => {
                if (!attributes.height) {
                  return {}
                }
                return {
                  height: attributes.height,
                }
              },
            },
            aspectRatio: {
              default: null,
              parseHTML: (element) => element.getAttribute("data-aspect-ratio") || element.style.aspectRatio,
              renderHTML: (attributes) => {
                if (!attributes.aspectRatio) {
                  return {}
                }
                return {
                  "data-aspect-ratio": attributes.aspectRatio,
                }
              },
            },
            alignment: {
              default: "center",
              parseHTML: (element) => element.getAttribute("data-alignment") || "center",
              renderHTML: (attributes) => {
                return {
                  "data-alignment": attributes.alignment || "center",
                }
              },
            },
            useDefaultSize: {
              default: false,
              parseHTML: (element) => element.getAttribute("data-use-default-size") === "true",
              renderHTML: (attributes) => {
                return {
                  "data-use-default-size": attributes.useDefaultSize ? "true" : "false",
                }
              },
            },
          }
        },
        renderHTML({ HTMLAttributes }) {
          const { width, aspectRatio, alignment, useDefaultSize, ...otherAttrs } = HTMLAttributes

          let style = "max-width: 100%; height: auto; border-radius: 0.5rem; display: block;"
          let className = "editor-image"

          // Handle width - if useDefaultSize is true, don't set width
          if (!useDefaultSize && width) {
            style += ` width: ${width};`
          }

          // Handle aspect ratio - only apply if not using default size
          if (!useDefaultSize && aspectRatio) {
            style += ` aspect-ratio: ${aspectRatio}; object-fit: cover;`
          }

          // Handle alignment with better CSS
          switch (alignment) {
            case "left":
              if (useDefaultSize) {
                style += " margin: 1rem 0;"
              } else {
                style += " float: left; margin: 0.5rem 1rem 0.5rem 0; clear: left;"
              }
              className += " image-align-left"
              break
            case "right":
              if (useDefaultSize) {
                style += " margin: 1rem 0 1rem auto;"
              } else {
                style += " float: right; margin: 0.5rem 0 0.5rem 1rem; clear: right;"
              }
              className += " image-align-right"
              break
            case "center":
            default:
              style += " margin: 1rem auto; clear: both;"
              className += " image-align-center"
              break
          }

          return [
            "img",
            {
              ...otherAttrs,
              style,
              class: className,
              "data-alignment": alignment,
              "data-use-default-size": useDefaultSize ? "true" : "false",
            },
          ]
        },
        addNodeView() {
          return ({ node, HTMLAttributes, getPos }) => {
            const img = document.createElement("img")

            const updateImageStyle = (attrs: any) => {
              const { width, aspectRatio, alignment, useDefaultSize, ...otherAttrs } = attrs

              let style = "max-width: 100%; height: auto; border-radius: 0.5rem; display: block;"
              let className = "editor-image"

              // Handle width
              if (!useDefaultSize && width) {
                style += ` width: ${width};`
              }

              // Handle aspect ratio
              if (!useDefaultSize && aspectRatio) {
                style += ` aspect-ratio: ${aspectRatio}; object-fit: cover;`
              }

              // Handle alignment
              switch (alignment) {
                case "left":
                  if (useDefaultSize) {
                    style += " margin: 1rem 0;"
                  } else {
                    style += " float: left; margin: 0.5rem 1rem 0.5rem 0; clear: left;"
                  }
                  className += " image-align-left"
                  break
                case "right":
                  if (useDefaultSize) {
                    style += " margin: 1rem 0 1rem auto;"
                  } else {
                    style += " float: right; margin: 0.5rem 0 0.5rem 1rem; clear: right;"
                  }
                  className += " image-align-right"
                  break
                case "center":
                default:
                  style += " margin: 1rem auto; clear: both;"
                  className += " image-align-center"
                  break
              }

              img.setAttribute("style", style)
              img.className = className
              img.setAttribute("data-alignment", alignment || "center")
              img.setAttribute("data-use-default-size", useDefaultSize ? "true" : "false")

              // Set other attributes
              Object.entries(otherAttrs).forEach(([key, value]) => {
                if (key !== "style" && key !== "class") {
                  img.setAttribute(key, value as string)
                }
              })
            }

            // Initial setup
            updateImageStyle(node.attrs)

            return {
              dom: img,
              update: (updatedNode) => {
                if (updatedNode.type.name !== "image") return false
                updateImageStyle(updatedNode.attrs)
                return true
              },
            }
          }
        },
      }).configure({
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline underline-offset-2 hover:text-blue-800",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Table.configure({
        resizable: true,
        lastColumnResizable: false,
        allowTableNodeSelection: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-gray-50 font-medium p-3 text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-3",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onTransaction: ({ editor }) => {
      updateHeadingLevel()
    },
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4",
      },
    },
  })

  if (!editor) {
    return null
  }

  const insertImage = () => {
    if (imageUrl.trim()) {
      const imageAttrs: any = {
        src: imageUrl,
        alt: imageAlt || "Image",
        alignment: imageAlignment,
        useDefaultSize: imageWidthType === "default",
      }

      // Only set width and aspect ratio if not using default size
      if (imageWidthType !== "default") {
        imageAttrs.width = `${imageWidthPercent[0]}%`
        imageAttrs.aspectRatio = imageAspectRatio[0].toString()
      }

      editor.chain().focus().setImage(imageAttrs).run()
      setImagePickerOpen(false)
      setImageUrl("")
      setImageAlt("")
      setImageWidthPercent([75])
      setImageWidthType("default")
      setImageAspectRatio([1.33])
      setImageAlignment("center")
    }
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter URL:", previousUrl)

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const addTable = () => {
    const rows = Number.parseInt(window.prompt("Enter number of rows:", "3") || "3")
    const cols = Number.parseInt(window.prompt("Enter number of columns:", "3") || "3")

    if (rows > 0 && cols > 0) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    }
  }

  const deleteTable = () => {
    setDeleteTableDialog(true)
  }

  const confirmDeleteTable = () => {
    editor.chain().focus().deleteTable().run()
  }

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run()
  }

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run()
  }

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run()
  }

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run()
  }

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run()
  }

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run()
  }

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const clearTextColor = () => {
    editor.chain().focus().unsetColor().run()
  }

  const updateTableSize = () => {
    const table = editor.view.dom.querySelector("table") as HTMLTableElement
    if (table) {
      table.style.width = `${tableWidth[0]}%`
      table.style.height = `${tableHeight[0]}px`
    }
  }

  const updateImageSize = () => {
    // Get the current selection
    const { selection } = editor.state
    const { from, to } = selection

    // Find image node in current selection or the selected image
    let imageNode: any = null
    let imagePos: number | null = null

    // First, try to find image in current selection
    editor.state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "image") {
        imageNode = node
        imagePos = pos
        return false
      }
    })

    // If no image in selection, find the most recently selected/focused image
    if (!imageNode) {
      // Look for images around the cursor position
      const $pos = editor.state.selection.$from
      const searchPos = $pos.pos

      // Search backwards and forwards from cursor position
      for (let i = Math.max(0, searchPos - 100); i < Math.min(editor.state.doc.content.size, searchPos + 100); i++) {
        try {
          const node = editor.state.doc.nodeAt(i)
          if (node && node.type.name === "image") {
            imageNode = node
            imagePos = i
            break
          }
        } catch (e) {
          // Continue searching
        }
      }
    }

    // If still no image found, get the last image in the document
    if (!imageNode) {
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "image") {
          imageNode = node
          imagePos = pos
        }
      })
    }

    if (imageNode && imagePos !== null) {
      // Update the image node with new dimensions and alignment
      const newAttrs: any = {
        ...imageNode.attrs,
        alignment: imageAlignment,
        useDefaultSize: imageWidthType === "default",
      }

      // Only set width and aspect ratio if not using default size
      if (imageWidthType !== "default") {
        newAttrs.width = `${imageWidthPercent[0]}%`
        newAttrs.aspectRatio = imageAspectRatio[0].toString()
      } else {
        // Remove width and aspectRatio when using default size
        delete newAttrs.width
        delete newAttrs.aspectRatio
      }

      const tr = editor.state.tr.setNodeMarkup(imagePos, null, newAttrs)
      editor.view.dispatch(tr)

      // Force a re-render to ensure the changes are visible
      setTimeout(() => {
        editor.view.updateState(editor.view.state)
        editor.commands.focus()
      }, 10)
    }
  }

  const insertButton = () => {
    editor.chain().focus().insertButton(buttonConfig).run()
    setButtonPickerOpen(false)
  }

  const clearIcon = () => {
    setButtonConfig((prev) => ({ ...prev, icon: "" }))
  }

  // Helper function to get preview colors
  const getPreviewColor = (colorValue: string) => {
    return colorValue
  }

  const setAspectRatio = (ratio: number) => {
    setImageAspectRatio([ratio])
  }

  const setWidthPreset = (width: "default" | number) => {
    if (width === "default") {
      setImageWidthType("default")
    } else {
      setImageWidthType(width)
      setImageWidthPercent([width])
    }
  }

  // Get current image attributes for editing
  const getCurrentImageAttributes = () => {
    const { selection } = editor.state
    const { from, to } = selection

    let imageNode: any = null
    editor.state.doc.nodesBetween(from, to, (node) => {
      if (node.type.name === "image") {
        imageNode = node
        return false
      }
    })

    if (imageNode) {
      const width = imageNode.attrs.width
      const aspectRatio = imageNode.attrs.aspectRatio
      const alignment = imageNode.attrs.alignment || "center"
      const useDefaultSize = imageNode.attrs.useDefaultSize || false

      // Set width type and percentage
      if (useDefaultSize) {
        setImageWidthType("default")
      } else if (width && width.includes("%")) {
        const widthPercent = Number.parseInt(width.replace("%", ""))
        setImageWidthType(widthPercent)
        setImageWidthPercent([widthPercent])
      }

      // Parse aspect ratio
      if (aspectRatio) {
        setImageAspectRatio([Number.parseFloat(aspectRatio)])
      }

      // Set alignment
      setImageAlignment(alignment)
    }
  }

  // Handle heading selection
  const handleHeadingChange = (level: string) => {
    if (level === "paragraph") {
      // Remove heading formatting
      editor.chain().focus().setParagraph().run()
      setHeadingLevel("paragraph")
    } else {
      const levelNum = parseInt(level) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level: levelNum }).run()
      setHeadingLevel(level)
    }
  }

  // Update heading level state based on editor state
  const updateHeadingLevel = () => {
    if (editor.isActive("heading", { level: 1 })) {
      setHeadingLevel("1")
    } else if (editor.isActive("heading", { level: 2 })) {
      setHeadingLevel("2")
    } else if (editor.isActive("heading", { level: 3 })) {
      setHeadingLevel("3")
    } else {
      setHeadingLevel("paragraph")
    }
  }

  return (
    <div className={`border rounded-lg transition-all duration-200 ${isFullscreen
        ? `fixed inset-0 z-50 w-screen h-screen max-h-none border-none rounded-none ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`
        : ''
      }`}>
      <div className={`flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50 transition-all duration-200 ${isFullscreen
          ? `sticky top-0 z-10 border-b shadow-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`
          : ''
        }`}>
        <Select value={headingLevel} onValueChange={handleHeadingChange}>
          <SelectTrigger className="w-16 h-8">
            <span className="font-bold">H</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">P</SelectItem>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-accent" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-accent" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "bg-accent" : ""}
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-accent" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-accent" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-accent" : ""}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={editor.isActive({ textAlign: "justify" }) ? "bg-accent" : ""}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button type="button" variant="ghost" size="sm" onClick={addLink}>
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Popover open={imagePickerOpen} onOpenChange={setImagePickerOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Insert Image">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Insert Image</h4>

              <div>
                <Label className="text-sm font-medium mb-2 block">Image URL *</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Alt Text (Optional)</Label>
                <Input
                  placeholder="Description of the image"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Size</Label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {widthPresets.map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      variant={imageWidthType === preset.value ? "default" : "outline"}
                      size="sm"
                      className="text-xs px-2 py-1 h-8"
                      onClick={() => setWidthPreset(preset.value)}
                      title={preset.name}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                {imageWidthType !== "default" && (
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={imageWidthPercent}
                      onValueChange={setImageWidthPercent}
                      max={100}
                      min={25}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-16">{imageWidthPercent[0]}%</span>
                  </div>
                )}
              </div>

              {imageWidthType !== "default" && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Aspect Ratio</Label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {aspectRatios.map((ratio) => (
                      <Button
                        key={ratio.value}
                        type="button"
                        variant={Math.abs(imageAspectRatio[0] - ratio.value) < 0.01 ? "default" : "outline"}
                        size="sm"
                        className="text-xs px-2 py-1 h-8"
                        onClick={() => setAspectRatio(ratio.value)}
                        title={ratio.name}
                      >
                        {ratio.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={imageAspectRatio}
                      onValueChange={setImageAspectRatio}
                      max={3}
                      min={0.3}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-16">{imageAspectRatio[0].toFixed(1)}</span>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">Alignment</Label>
                <div className="grid grid-cols-3 gap-2">
                  {imageAlignments.map((align) => {
                    const IconComponent = align.icon
                    return (
                      <Button
                        key={align.value}
                        type="button"
                        variant={imageAlignment === align.value ? "default" : "outline"}
                        size="sm"
                        className="text-xs px-2 py-1 h-8 flex items-center justify-center gap-1"
                        onClick={() => setImageAlignment(align.value)}
                        title={align.name}
                      >
                        <IconComponent className="h-3 w-3" />
                        {align.name}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {imageUrl && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Preview</Label>
                  <div className="border rounded p-2 bg-muted/20">
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent:
                          imageAlignment === "left" ? "flex-start" : imageAlignment === "right" ? "flex-end" : "center",
                      }}
                    >
                      <div
                        style={{
                          width: imageWidthType === "default" ? "auto" : `${Math.min(imageWidthPercent[0], 80)}%`,
                          aspectRatio: imageWidthType === "default" ? "auto" : imageAspectRatio[0].toString(),
                          maxWidth: "300px",
                        }}
                      >
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={imageAlt || "Preview"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: imageWidthType === "default" ? "contain" : "cover",
                          }}
                          className="rounded"
                          onError={(e) => {
                            ; (e.target as HTMLImageElement).style.display = "none"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button type="button" onClick={insertImage} className="w-full" disabled={!imageUrl.trim()}>
                Insert Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button type="button" variant="ghost" size="sm" onClick={addTable}>
          <TableIcon className="h-4 w-4" />
        </Button>

        <Popover open={buttonPickerOpen} onOpenChange={setButtonPickerOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Insert Button">
              <SquarePlus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[800px] h-[500px] p-0" align="start">
            <div className="p-4 h-full flex flex-col">
              <h4 className="font-medium text-sm mb-4">Insert Button</h4>

              <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
                {/* Left Column - Content & Type */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium">Content</Label>
                    <div className="space-y-2 mt-1">
                      <Input
                        placeholder="Button text (optional)"
                        value={buttonConfig.text}
                        onChange={(e) => setButtonConfig((prev) => ({ ...prev, text: e.target.value }))}
                        className="h-8"
                      />
                      <div className="flex gap-1">
                        {buttonTypes.map((type) => (
                          <Button
                            key={type.value}
                            type="button"
                            variant={buttonConfig.buttonType === type.value ? "default" : "outline"}
                            size="sm"
                            className="text-xs px-3 py-1 h-7 flex-1"
                            onClick={() => setButtonConfig((prev) => ({ ...prev, buttonType: type.value }))}
                          >
                            {type.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Size Settings */}
                  <div>
                    <Label className="text-xs font-medium">Size</Label>
                    <div className="space-y-3 mt-1">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Width</span>
                          <span className="text-xs text-muted-foreground">{buttonConfig.width}px</span>
                        </div>
                        <Slider
                          value={[Number.parseInt(buttonConfig.width)]}
                          onValueChange={(value) =>
                            setButtonConfig((prev) => ({ ...prev, width: value[0].toString() }))
                          }
                          max={300}
                          min={60}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Height</span>
                          <span className="text-xs text-muted-foreground">{buttonConfig.height}px</span>
                        </div>
                        <Slider
                          value={[Number.parseInt(buttonConfig.height)]}
                          onValueChange={(value) =>
                            setButtonConfig((prev) => ({ ...prev, height: value[0].toString() }))
                          }
                          max={80}
                          min={24}
                          step={2}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <Label className="text-xs font-medium">Options</Label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={buttonConfig.hasBorder}
                          onChange={(e) => setButtonConfig((prev) => ({ ...prev, hasBorder: e.target.checked }))}
                          className="rounded"
                        />
                        Border
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={buttonConfig.hasShadow}
                          onChange={(e) => setButtonConfig((prev) => ({ ...prev, hasShadow: e.target.checked }))}
                          className="rounded"
                        />
                        Shadow
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <Label className="text-xs font-medium">Preview</Label>
                    <div className="mt-1 p-3 border rounded bg-muted/20 flex justify-center">
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.375rem",
                          fontWeight: "500",
                          backgroundColor:
                            buttonConfig.buttonType === "outline"
                              ? "transparent"
                              : getPreviewColor(buttonConfig.backgroundColor),
                          color:
                            buttonConfig.buttonType === "outline"
                              ? getPreviewColor(buttonConfig.borderColor)
                              : getPreviewColor(buttonConfig.textColor),
                          border: buttonConfig.hasBorder
                            ? `2px solid ${getPreviewColor(buttonConfig.borderColor)}`
                            : "none",
                          boxShadow: buttonConfig.hasShadow
                            ? `0 4px 6px -1px ${getPreviewColor(buttonConfig.borderColor)}40`
                            : "none",
                          width: `${buttonConfig.width}px`,
                          height: `${buttonConfig.height}px`,
                          fontSize: `${Math.max(10, Math.min(18, Number.parseInt(buttonConfig.height) * 0.35))}px`,
                        }}
                      >
                        {buttonConfig.icon && (
                          <span style={{ marginRight: buttonConfig.text ? "0.25rem" : "0" }}>
                            [{buttonConfig.icon}]
                          </span>
                        )}
                        {buttonConfig.text || (!buttonConfig.text && !buttonConfig.icon ? "Button" : "")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Colors */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium">Colors</Label>
                    <div className="space-y-3 mt-1">
                      <div>
                        <span className="text-xs text-muted-foreground mb-2 block">Background</span>
                        <div className="grid grid-cols-6 gap-1">
                          {colors.map((color) => (
                            <Button
                              key={color.value}
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={`h-8 w-8 p-0 rounded-full border-2 hover:border-muted-foreground ${buttonConfig.backgroundColor === color.value
                                  ? "border-foreground"
                                  : "border-transparent"
                                }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => setButtonConfig((prev) => ({ ...prev, backgroundColor: color.value }))}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-muted-foreground mb-2 block">Text</span>
                        <div className="grid grid-cols-6 gap-1">
                          {colors.map((color) => (
                            <Button
                              key={color.value}
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={`h-8 w-8 p-0 rounded-full border-2 hover:border-muted-foreground ${buttonConfig.textColor === color.value ? "border-foreground" : "border-transparent"
                                }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => setButtonConfig((prev) => ({ ...prev, textColor: color.value }))}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-muted-foreground mb-2 block">Border</span>
                        <div className="grid grid-cols-6 gap-1">
                          {colors.map((color) => (
                            <Button
                              key={color.value}
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={`h-8 w-8 p-0 rounded-full border-2 hover:border-muted-foreground ${buttonConfig.borderColor === color.value ? "border-foreground" : "border-transparent"
                                }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => setButtonConfig((prev) => ({ ...prev, borderColor: color.value }))}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      {buttonConfig.icon && (
                        <div>
                          <span className="text-xs text-muted-foreground mb-2 block">Icon Color</span>
                          <div className="grid grid-cols-6 gap-1">
                            {colors.map((color) => (
                              <Button
                                key={color.value}
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 rounded-full border-2 hover:border-muted-foreground ${buttonConfig.iconColor === color.value ? "border-foreground" : "border-transparent"
                                  }`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setButtonConfig((prev) => ({ ...prev, iconColor: color.value }))}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Icons */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-medium">Icon (Optional)</Label>
                      {buttonConfig.icon && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearIcon}
                          className="h-6 px-2 text-xs"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search icons..."
                        value={iconSearchQuery}
                        onChange={(e) => setIconSearchQuery(e.target.value)}
                        className="h-8 pl-8"
                      />
                    </div>
                  </div>

                  <div className="h-80 overflow-y-auto border rounded-md">
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {filteredIcons.length > 0 ? (
                        filteredIcons
                          .filter((iconName) => (LucideIcons as any)[iconName])
                          .map((iconName) => {
                            const IconComponent = (LucideIcons as any)[iconName]
                            if (!IconComponent) return null

                            return (
                              <Button
                                key={iconName}
                                type="button"
                                variant={buttonConfig.icon === iconName ? "default" : "ghost"}
                                size="sm"
                                className="h-12 w-full p-1 hover:bg-accent flex flex-col items-center justify-center gap-1"
                                onClick={() => setButtonConfig((prev) => ({ ...prev, icon: iconName }))}
                                title={iconName}
                              >
                                <IconComponent className="h-4 w-4 flex-shrink-0" />
                                <span className="text-xs truncate w-full text-center leading-tight">
                                  {iconName.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                              </Button>
                            )
                          })
                      ) : (
                        <div className="col-span-4 text-center py-8 text-muted-foreground">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No icons found</p>
                          <p className="text-xs">Try a different search term</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t">
                <Button type="button" onClick={insertButton} className="w-full" size="sm">
                  Insert Button
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {editor.isActive("table") && (
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="bg-accent">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Table Width (%)</Label>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={tableWidth}
                      onValueChange={setTableWidth}
                      max={100}
                      min={20}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">{tableWidth[0]}%</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Table Height (px)</Label>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={tableHeight}
                      onValueChange={setTableHeight}
                      max={800}
                      min={100}
                      step={20}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-16">{tableHeight[0]}px</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={updateTableSize}
                  className="w-full bg-transparent"
                >
                  Apply Size
                </Button>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2">Columns</h4>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addColumnBefore}
                      className="flex-1 bg-transparent"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Before
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addColumnAfter}
                      className="flex-1 bg-transparent"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      After
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={deleteColumn}>
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Rows</h4>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRowBefore}
                      className="flex-1 bg-transparent"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Before
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRowAfter}
                      className="flex-1 bg-transparent"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      After
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={deleteRow}>
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <Button type="button" variant="destructive" size="sm" onClick={deleteTable} className="w-full">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete Table
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {editor.isActive("image") && (
          <Popover onOpenChange={(open) => open && getCurrentImageAttributes()}>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="bg-accent" title="Edit Image">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Image Settings</h4>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Size</Label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {widthPresets.map((preset) => (
                      <Button
                        key={preset.value}
                        type="button"
                        variant={imageWidthType === preset.value ? "default" : "outline"}
                        size="sm"
                        className="text-xs px-2 py-1 h-8"
                        onClick={() => setWidthPreset(preset.value)}
                        title={preset.name}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  {imageWidthType !== "default" && (
                    <div className="flex items-center space-x-3">
                      <Slider
                        value={imageWidthPercent}
                        onValueChange={setImageWidthPercent}
                        max={100}
                        min={25}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-16">{imageWidthPercent[0]}%</span>
                    </div>
                  )}
                </div>

                {imageWidthType !== "default" && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Aspect Ratio</Label>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      {aspectRatios.map((ratio) => (
                        <Button
                          key={ratio.value}
                          type="button"
                          variant={Math.abs(imageAspectRatio[0] - ratio.value) < 0.01 ? "default" : "outline"}
                          size="sm"
                          className="text-xs px-2 py-1 h-8"
                          onClick={() => setAspectRatio(ratio.value)}
                          title={ratio.name}
                        >
                          {ratio.label}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Slider
                        value={imageAspectRatio}
                        onValueChange={setImageAspectRatio}
                        max={3}
                        min={0.3}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-16">{imageAspectRatio[0].toFixed(1)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium mb-2 block">Alignment</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {imageAlignments.map((align) => {
                      const IconComponent = align.icon
                      return (
                        <Button
                          key={align.value}
                          type="button"
                          variant={imageAlignment === align.value ? "default" : "outline"}
                          size="sm"
                          className="text-xs px-2 py-1 h-8 flex items-center justify-center gap-1"
                          onClick={() => setImageAlignment(align.value)}
                          title={align.name}
                        >
                          <IconComponent className="h-3 w-3" />
                          {align.name}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={updateImageSize}
                  className="w-full bg-transparent"
                >
                  Apply Changes
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <Separator orientation="vertical" className="h-6" />

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Text Color</h4>
              <div className="grid grid-cols-5 gap-2">
                {colors.slice(1).map((color) => (
                  <Button
                    key={color.value}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full border-2 border-transparent hover:border-muted-foreground"
                    style={{ backgroundColor: color.value }}
                    onClick={() => setTextColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-transparent"
                onClick={clearTextColor}
              >
                Clear Color
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      <EditorContent
        editor={editor}
        className={`prose prose-sm max-w-none ${isFullscreen
            ? `h-[calc(100vh-60px)] overflow-y-auto p-4 ${theme === 'dark' ? 'prose-invert bg-gray-900' : 'bg-white'
            }`
            : 'min-h-[200px] p-4'
          }`}
      />

      <ConfirmDialog
        open={deleteTableDialog}
        onOpenChange={setDeleteTableDialog}
        title="Delete Table"
        description="Are you sure you want to delete this table? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeleteTable}
      />
    </div>
  )
}
