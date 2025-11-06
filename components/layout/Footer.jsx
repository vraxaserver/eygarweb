import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react'; // Example icon

export default function Footer() {

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*
          Main Flex Container:
          - flex-col: Stacks children vertically on mobile (default).
          - md:flex-row: Switches to a horizontal layout on medium screens and up.
          - gap-6: Adds space between the stacked items on mobile.
          - justify-between: Pushes children to opposite ends on desktop.
          - items-center: Keeps content vertically aligned in the center.
        */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/*
            Left Side (Copyright & Links):
            - flex-wrap: Allows links to wrap to the next line on narrow screens.
            - justify-center: Centers the links when they are stacked in the column.
            - md:justify-start: Aligns links to the left on desktop.
            - gap-x-4: Horizontal gap between items.
            - gap-y-2: Vertical gap for when items wrap.
          */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-600">
            <span>© 2025 EYGAR, Inc.</span>
            {/* These separators are hidden on extra-small screens to look cleaner when wrapping */}
            <span className="hidden sm:inline">•</span>
            <button className="hover:text-gray-900">Terms</button>
            <span className="hidden sm:inline">•</span>
            <button className="hover:text-gray-900">Privacy</button>
            <span className="hidden sm:inline">•</span>
            <button className="hover:text-gray-900">& More</button>
          </div>

          {/* Right Side (Language & Currency) */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>English (US)</span>
            </Button>
            <Button variant="ghost" size="sm">
              $ USD
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
