import { Button } from '@/components/ui/button';

export default function Footer() {

  return (
      <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>© 2024 EYGAR, Inc.</span>
                      <span>•</span>
                      <button className="hover:text-gray-900">Terms</button>
                      <span>•</span>
                      <button className="hover:text-gray-900">Privacy</button>
                      <span>•</span>
                      <button className="hover:text-gray-900">& More</button>
                  </div>

                  <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                          English (US)
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
