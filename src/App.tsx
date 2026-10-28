import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  Eye,
  Heart,
  HelpCircle,
  Instagram,
  Menu,
  Minus,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Truck,
  User,
  X,
} from 'lucide-react'
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { money, products, type Product } from './data/products'
import { storefrontConfig } from './storefront/config'
import './App.css'

// Types
type BagItem = {
  key: string
  productId: string
  size: string
  color: string
  quantity: number
}

type Notice = {
  id: number
  message: string
}

type OrderRecord = {
  id: string
  date: string
  customerName: string
  email: string
  address: string
  items: { product: Product; size: string; quantity: number }[]
  total: number
  status: 'Processing' | 'Dispatched' | 'Delivered'
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch (error) {
    console.error(`Unable to read ${key} from storage.`, error)
    return fallback
  }
}

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStored(key, fallback))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Unable to save ${key} to storage.`, error)
    }
  }, [key, value])
  return [value, setValue] as const
}

// Main App Component
export default function App() {
  const [bag, setBag] = useStoredState<BagItem[]>('monochrome-bag', [
    { key: '01-S', productId: '01', size: 'S', color: 'Warm Stone', quantity: 1 },
  ])
  const [wishlist, setWishlist] = useStoredState<string[]>('monochrome-wishlist', ['01', '03'])
  const [orders, setOrders] = useStoredState<OrderRecord[]>('monochrome-orders', [
    {
      id: 'MS-89211',
      date: '24 Oct 2025',
      customerName: 'Priya Sharma',
      email: 'priya.s@example.com',
      address: '42 Kasturba Gandhi Marg, New Delhi 110001',
      items: [
        { product: products[0], size: 'S', quantity: 1 },
        { product: products[1], size: 'M', quantity: 1 },
      ],
      total: 13280,
      status: 'Dispatched',
    },
  ])

  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [megaMenu, setMegaMenu] = useState(false)
  const [bagDrawerOpen, setBagDrawerOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const location = useLocation()

  useEffect(() => {
    setMobileMenu(false)
    setMegaMenu(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.search])

  const notify = (message: string) => {
    const id = Date.now()
    setNotice({ id, message })
    window.setTimeout(() => setNotice((curr) => (curr?.id === id ? null : curr)), 3200)
  }

  const addToBag = (product: Product, size: string, color?: string, quantity = 1) => {
    const chosenColor = color || product.colorName
    const key = `${product.id}-${size}-${chosenColor}`
    setBag((curr) => {
      const existing = curr.find((item) => item.key === key)
      if (existing) {
        return curr.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...curr, { key, productId: product.id, size, color: chosenColor, quantity }]
    })
    notify(`${product.name} (${size}) added to your bag`)
    setBagDrawerOpen(true)
  }

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.includes(product.id)
    setWishlist((curr) => (exists ? curr.filter((id) => id !== product.id) : [...curr, product.id]))
    notify(exists ? 'Removed from your wishlist' : 'Saved to your wishlist')
  }

  const changeQuantity = (key: string, quantity: number) => {
    setBag((curr) =>
      quantity < 1
        ? curr.filter((item) => item.key !== key)
        : curr.map((item) => (item.key === key ? { ...item, quantity } : item)),
    )
  }

  const bagCount = bag.reduce((count, item) => count + item.quantity, 0)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* Top Announcement Bar */}
      <Announcement />

      {/* Sticky Art-Directed Header */}
      <Header
        bagCount={bagCount}
        wishlistCount={wishlist.length}
        mobileMenu={mobileMenu}
        megaMenu={megaMenu}
        onMenu={() => setMobileMenu((open) => !open)}
        onMega={() => setMegaMenu((open) => !open)}
        onOpenBag={() => setBagDrawerOpen(true)}
        onClose={() => {
          setMobileMenu(false)
          setMegaMenu(false)
        }}
      />

      {/* Main Content Router */}
      <main id="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onAdd={addToBag}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onQuickView={setQuickViewProduct}
                currency={currency}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <CollectionPage
                title="All Pieces"
                eyebrow="The Full Collection"
                description="Considered foundations cut from exceptional fabrics. Designed for everyday elevation."
                onAdd={addToBag}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onQuickView={setQuickViewProduct}
                currency={currency}
              />
            }
          />
          <Route
            path="/new-arrivals"
            element={
              <CollectionPage
                title="New Arrivals"
                eyebrow="Autumn / Winter 25"
                description="The latest editorial arrivals. Sculptural tailoring, cocoon knits, and quiet luxury."
                mode="new"
                onAdd={addToBag}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onQuickView={setQuickViewProduct}
                currency={currency}
              />
            }
          />
          <Route
            path="/women"
            element={
              <CollectionPage
                title="Women"
                eyebrow="The Women’s Edit"
                description="Fluid trousers, sculpted outerwear, and fine gauge silk knitwear."
                mode="Women"
                onAdd={addToBag}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onQuickView={setQuickViewProduct}
                currency={currency}
              />
            }
          />
          <Route
            path="/men"
            element={
              <CollectionPage
                title="Men"
                eyebrow="The Men’s Edit"
                description="Double-faced wool coats, crisp Japanese poplin, and relaxed pleat trousers."
                mode="Men"
                onAdd={addToBag}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onQuickView={setQuickViewProduct}
                currency={currency}
              />
            }
          />
          <Route
            path="/collections"
            element={
              <CollectionPage
                title="The Considered Edit"
                eyebrow="Editorial Wardrobe"
                description="Curated capsules designed to integrate effortlessly into personal style."
                onAdd={addToBag}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onQuickView={setQuickViewProduct}
                currency={currency}
              />
            }
          />
          <Route path="/journal" element={<JournalPage />} />
          <Route
            path="/search"
            element={
              <SearchPage
                onAdd={addToBag}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onQuickView={setQuickViewProduct}
                currency={currency}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductPage
                onAdd={addToBag}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                currency={currency}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onAdd={addToBag}
                currency={currency}
              />
            }
          />
          <Route
            path="/bag"
            element={<BagPage bag={bag} onChange={changeQuantity} currency={currency} />}
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                bag={bag}
                currency={currency}
                onOrderPlaced={(newOrder) => {
                  setOrders((prev) => [newOrder, ...prev])
                  setBag([])
                }}
              />
            }
          />
          <Route
            path="/account"
            element={<AccountPage orders={orders} wishlistCount={wishlist.length} currency={currency} />}
          />
          <Route
            path="/admin"
            element={
              <AdminSuitePage
                orders={orders}
                currency={currency}
                onUpdateOrderStatus={(id, status) => {
                  setOrders((curr) =>
                    curr.map((order) => (order.id === id ? { ...order, status } : order)),
                  )
                  notify(`Order ${id} marked as ${status}`)
                }}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Slide-out Shopping Bag Drawer */}
      {bagDrawerOpen && (
        <BagDrawer
          bag={bag}
          onChange={changeQuantity}
          onClose={() => setBagDrawerOpen(false)}
          currency={currency}
        />
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAdd={addToBag}
          saved={wishlist.includes(quickViewProduct.id)}
          onWishlist={toggleWishlist}
          currency={currency}
        />
      )}

      {/* Premium Studio Footer */}
      <Footer currency={currency} onCurrencyChange={setCurrency} />

      {/* Toast Feedback */}
      {notice && (
        <div className="toast" role="status">
          <Check size={16} strokeWidth={2} />
          {notice.message}
        </div>
      )}
    </div>
  )
}

// Announcement Bar
function Announcement() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <aside className="announcement" aria-label="Store Announcement">
      <span>Complimentary shipping on orders over <strong>₹4,999</strong></span>
      <span className="announcement-separator" aria-hidden="true">—</span>
      <span className="hidden md:inline">Considered essentials, delivered worldwide.</span>
      <button
        className="icon-button text-xs ml-auto opacity-70 hover:opacity-100"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
      >
        <X size={13} />
      </button>
    </aside>
  )
}

// Header & Navigation
function Header({
  bagCount,
  wishlistCount,
  mobileMenu,
  megaMenu,
  onMenu,
  onMega,
  onOpenBag,
  onClose,
}: {
  bagCount: number
  wishlistCount: number
  mobileMenu: boolean
  megaMenu: boolean
  onMenu: () => void
  onMega: () => void
  onOpenBag: () => void
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!query.trim()) return
    setSearchOpen(false)
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="site-header">
      <div className="header-main">
        {/* Mobile menu trigger */}
        <button
          className="icon-button mobile-menu-button"
          onClick={onMenu}
          aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'}
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Minimal Refined Wordmark */}
        <Link to="/" className="wordmark" aria-label="MONOCHROME STUDIO" onClick={onClose}>
          <span>MONOCHROME</span>
          <small>STUDIO</small>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main navigation">
          <button
            className={`nav-link ${megaMenu ? 'is-open' : ''}`}
            onClick={onMega}
            aria-expanded={megaMenu}
          >
            Shop <ChevronDown size={13} className={`transition-transform ${megaMenu ? 'rotate-180' : ''}`} />
          </button>
          <Link className="nav-link" to="/new-arrivals">
            New Arrivals
          </Link>
          <Link className="nav-link" to="/women">
            Women
          </Link>
          <Link className="nav-link" to="/men">
            Men
          </Link>
          <Link className="nav-link" to="/collections">
            Collections
          </Link>
          <Link className="nav-link" to="/journal">
            Journal
          </Link>
        </nav>

        {/* Header Action Icons */}
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search collection"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <Search size={19} strokeWidth={1.5} />
          </button>

          <Link
            className="icon-button hidden sm:flex"
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart size={19} strokeWidth={1.5} />
            {wishlistCount > 0 && <span className="bag-count">{wishlistCount}</span>}
          </Link>

          <Link className="icon-button" to="/account" aria-label="Customer Account">
            <User size={19} strokeWidth={1.5} />
          </Link>

          <button
            className="icon-button bag-action"
            onClick={onOpenBag}
            aria-label={`Shopping bag with ${bagCount} items`}
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
            {bagCount > 0 && <span className="bag-count">{bagCount}</span>}
          </button>
        </div>
      </div>

      {/* Refined Mega Menu */}
      {megaMenu && <MegaMenu onClose={onClose} />}

      {/* Search Drawer */}
      {searchOpen && (
        <form className="search-drawer" onSubmit={submitSearch}>
          <Search size={20} className="text-[#555555]" />
          <input
            autoFocus
            aria-label="Search products"
            placeholder="Search by piece, fabric or silhouette (e.g. 'sculpted blazer', 'merino', 'poplin')..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="button button-dark py-2 px-5 text-xs" type="submit">
            Search
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            <X size={20} />
          </button>
        </form>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenu && (
        <nav className="mobile-drawer" aria-label="Mobile navigation">
          <Link to="/shop" onClick={onClose}>
            Shop All <ArrowRight size={18} />
          </Link>
          <Link to="/new-arrivals" onClick={onClose}>
            New Arrivals <ArrowRight size={18} />
          </Link>
          <Link to="/women" onClick={onClose}>
            Women <ArrowRight size={18} />
          </Link>
          <Link to="/men" onClick={onClose}>
            Men <ArrowRight size={18} />
          </Link>
          <Link to="/collections" onClick={onClose}>
            Collections <ArrowRight size={18} />
          </Link>
          <Link to="/journal" onClick={onClose}>
            Journal <ArrowRight size={18} />
          </Link>

          <div className="mobile-drawer-bottom">
            <Link to="/wishlist" onClick={onClose}>
              Wishlist ({wishlistCount})
            </Link>
            <Link to="/account" onClick={onClose}>
              Your Studio Account
            </Link>
            <Link to="/admin" onClick={onClose} className="text-[#8C7D70]">
              Merchant SaaS Suite →
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

// Mega Menu
function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="mega-menu" onMouseLeave={onClose}>
      <div className="mega-links">
        <span className="eyebrow">Curated Collections</span>
        <Link to="/shop" onClick={onClose}>
          Shop All Pieces <ArrowRight size={14} />
        </Link>
        <Link to="/new-arrivals" onClick={onClose}>
          Autumn / Winter 25 <ArrowRight size={14} />
        </Link>
        <Link to="/women" onClick={onClose}>
          Women’s Tailoring <ArrowRight size={14} />
        </Link>
        <Link to="/men" onClick={onClose}>
          Men’s Outerwear &amp; Shirts <ArrowRight size={14} />
        </Link>
        <Link to="/collections" onClick={onClose}>
          Everyday Essentials <ArrowRight size={14} />
        </Link>
        <Link to="/journal" onClick={onClose}>
          Studio Journal <ArrowRight size={14} />
        </Link>
      </div>

      <Link to="/collections" className="mega-feature" onClick={onClose}>
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=960&q=85"
          alt="Neutral everyday wardrobe editorial"
          loading="lazy"
        />
        <span>
          Everyday Essentials <ArrowRight size={14} />
        </span>
      </Link>

      <Link to="/new-arrivals" className="mega-feature" onClick={onClose}>
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=960&q=85"
          alt="Contemporary tailored fashion"
          loading="lazy"
        />
        <span>
          Autumn / Winter Edit <ArrowRight size={14} />
        </span>
      </Link>
    </div>
  )
}

// Homepage Component
function Home({
  onAdd,
  wishlist,
  onWishlist,
  onQuickView,
  currency,
}: {
  onAdd: (product: Product, size: string, color?: string) => void
  wishlist: string[]
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  return (
    <>
      {/* Full-Screen Edge-to-Edge Hero */}
      <section className="hero">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=90"
          alt="Model wearing contemporary neutral-toned minimalist tailoring in warm afternoon studio light"
        />
        <div className="hero-shade" />

        <div className="hero-copy">
          <span className="hero-kicker">AUTUMN / WINTER 25 · ISSUE 04</span>
          <h1>
            LESS,
            <br />
            <em>BUT BETTER.</em>
          </h1>
          <p>Considered essentials. Designed to last.</p>
          <div className="hero-actions">
            <Link to="/shop" className="button button-light">
              Explore the Collection <ArrowRight size={16} />
            </Link>
            <Link to="/journal" className="hero-story-link">
              Discover Our Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="hero-pagination" aria-hidden="true">
          <span>01</span>
          <i />
          <span>04</span>
        </div>
        <a className="hero-scroll" href="#collections">
          <span>Scroll to discover</span>
          <ArrowDown size={14} />
        </a>
        <span className="hero-credit">MONOCHROME STUDIO — ART DIRECTION 2025</span>
      </section>

      {/* Featured Collections Asymmetrical Grid */}
      <section className="collection-section section-wrap" id="collections">
        <SectionHeading
          eyebrow="Editorial Curation"
          title={
            <>
              Featured
              <br />
              <em>Collections.</em>
            </>
          }
          aside="A quieter point of view. Pieces designed to integrate seamlessly into your personal rotation."
        />

        <div className="collection-layout">
          <CollectionTile
            className="collection-large"
            image="photo-1483985988355-763728e1935b"
            label="Everyday Essentials"
            detail="01 / Foundation"
            href="/collections"
          />
          <CollectionTile
            className="collection-small"
            image="photo-1539109136881-3be0616acf4b"
            label="New Arrivals"
            detail="02 / Just Landed"
            href="/new-arrivals"
          />
          <CollectionTile
            className="collection-small"
            image="photo-1515886657613-9f3515b0c78f"
            label="Modern Tailoring"
            detail="03 / Form &amp; Silhouette"
            href="/women"
          />
          <Link to="/men" className="collection-strip">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85"
              alt="Seasonal Edit coat campaign"
              loading="lazy"
            />
            <span>
              <div>
                <small>04 / Seasonal Edit</small>
                <strong>
                  A Softer
                  <br />
                  Structure.
                </strong>
              </div>
              <span className="collection-arrow">
                <ArrowRight size={20} />
              </span>
            </span>
          </Link>
        </div>
      </section>

      {/* Bestsellers Section (4-col desktop, 2-col mobile) */}
      <section className="bestsellers-section">
        <div className="section-wrap">
          <div className="section-heading-inline">
            <SectionHeading
              eyebrow="Studio Favourites"
              title={
                <>
                  Considered <em>Bestsellers.</em>
                </>
              }
            />
            <Link to="/shop" className="underlined-link">
              Shop All Pieces <ArrowRight size={15} />
            </Link>
          </div>

          <ProductGrid
            items={products.slice(0, 4)}
            onAdd={onAdd}
            wishlist={wishlist}
            onWishlist={onWishlist}
            onQuickView={onQuickView}
            currency={currency}
          />
        </div>
      </section>

      {/* Editorial Campaign Spread ("A STUDY IN SIMPLICITY") */}
      <section className="campaign">
        <div className="campaign-image">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1900&q=90"
            alt="Editorial campaign study in simplicity"
            loading="lazy"
          />
          <span className="campaign-index">STUDY 02 — FORM &amp; DRAPE</span>
        </div>
        <div className="campaign-copy">
          <span className="eyebrow">Editorial Campaign</span>
          <h2>
            A STUDY IN
            <br />
            <em>SIMPLICITY.</em>
          </h2>
          <p>
            Not more, but more meaningful. Our garments are sculpted with precision, using extra-fine
            virgin wool, Japanese poplin, and long-staple pima silk cotton. A quiet confidence
            that never demands attention.
          </p>
          <Link to="/journal" className="button button-dark">
            Read the Editorial Story <ArrowRight size={16} />
          </Link>
          <span className="campaign-note">A considered aesthetic, crafted since day one.</span>
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="philosophy section-wrap">
        <span className="eyebrow">Studio Principles</span>
        <div className="philosophy-grid">
          <h2>
            Fewer things.
            <br />
            <em>Better thought.</em>
          </h2>
          <div className="philosophy-intro">
            <p>
              We believe a wardrobe should feel like an extension of you. Not cluttered with fleeting
              trends, but composed of timeless pieces crafted from certified natural fibers that age
              with grace.
            </p>
            <Link to="/journal" className="underlined-link">
              Read Our Brand Manifesto <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="principle-list">
          <Principle
            number="01"
            title="Made to be Worn"
            body="Proportion, comfort, and tactile durability guide every design. The best garments work hard without asking for attention."
          />
          <Principle
            number="02"
            title="A Considered Point of View"
            body="We design with restraint: natural textures, modern architectural cuts, and a neutral palette that feels at home in any wardrobe."
          />
          <Principle
            number="03"
            title="Quality in the Details"
            body="From the weight of a natural horn button to blind-stitched hems and cupro lining, we take pride in the quiet details you notice over time."
          />
        </div>
      </section>

      {/* Journal Teaser */}
      <JournalTeaser />

      {/* Newsletter */}
      <Newsletter />
    </>
  )
}

// Section Heading Component
function SectionHeading({
  eyebrow,
  title,
  aside,
}: {
  eyebrow: string
  title: ReactNode
  aside?: string
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {aside && <p className="section-aside">{aside}</p>}
    </div>
  )
}

// Collection Tile Component
function CollectionTile({
  className,
  image,
  label,
  detail,
  href,
}: {
  className: string
  image: string
  label: string
  detail: string
  href: string
}) {
  return (
    <Link className={`collection-tile ${className}`} to={href}>
      <img
        src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=1200&q=85`}
        alt={`${label} editorial collection`}
        loading="lazy"
      />
      <span className="tile-label">
        <small>{detail}</small>
        <strong>{label}</strong>
      </span>
      <span className="tile-arrow">
        <ArrowRight size={18} />
      </span>
    </Link>
  )
}

// Principle Component
function Principle({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <article className="principle">
      <span className="principle-number">{number}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  )
}

// Journal Teaser Component
function JournalTeaser() {
  const stories = [
    {
      number: '01',
      category: 'Personal Style',
      title: 'The Art of the Considered Wardrobe',
      image: 'photo-1483985988355-763728e1935b',
      path: '/journal#personal-style',
    },
    {
      number: '02',
      category: 'Material Focus',
      title: 'Why We Choose 100% Virgin Double-Face Wool',
      image: 'photo-1529139574466-a303027c1d8b',
      path: '/journal#wardrobe',
    },
    {
      number: '03',
      category: 'Studio Notes',
      title: 'Finding Beauty in Everyday Proportion',
      image: 'photo-1490481651871-ab68de25d43d',
      path: '/journal#design',
    },
  ]
  return (
    <section className="journal-section section-wrap">
      <div className="section-heading-inline">
        <SectionHeading
          eyebrow="Notes from the Studio"
          title={
            <>
              The <em>Journal.</em>
            </>
          }
        />
        <Link to="/journal" className="underlined-link">
          Read All Essays <ArrowRight size={15} />
        </Link>
      </div>
      <div className="journal-grid">
        {stories.map((story) => (
          <Link to={story.path} className="journal-card" key={story.number}>
            <div className="journal-image">
              <img
                src={`https://images.unsplash.com/${story.image}?auto=format&fit=crop&w=900&q=85`}
                alt=""
                loading="lazy"
              />
              <span>{story.number}</span>
            </div>
            <span className="eyebrow">{story.category}</span>
            <h3>{story.title}</h3>
            <span className="journal-read">
              Read Story <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Newsletter Component
function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please provide a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <span className="eyebrow text-[#D9D5CE]">Exclusive Correspondence</span>
        <h2>
          A NOTE FROM
          <br />
          <em>THE STUDIO.</em>
        </h2>
        <p>
          Receive private invitations to new capsule releases, editorial reading, and seasonal
          collections. We only write when we have something considered to share.
        </p>

        {submitted ? (
          <div className="newsletter-success" role="status">
            <Check size={18} /> You are now subscribed. Welcome to MONOCHROME STUDIO.
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={submit} noValidate>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'newsletter-error' : undefined}
            />
            <button type="submit" aria-label="Subscribe to studio newsletter">
              <ArrowRight size={20} />
            </button>
            {error && (
              <span className="form-error absolute -bottom-6 left-0 text-xs text-red-400" id="newsletter-error">
                {error}
              </span>
            )}
          </form>
        )}
        <span className="newsletter-fine-print">
          Complimentary cancellation at any time. We respect your digital peace.
        </span>
      </div>
    </section>
  )
}

// Product Grid Component
function ProductGrid({
  items,
  onAdd,
  wishlist,
  onWishlist,
  onQuickView,
  currency,
}: {
  items: Product[]
  onAdd: (product: Product, size: string, color?: string) => void
  wishlist: string[]
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <span className="eyebrow">No Pieces Found</span>
        <p>Try resetting your filters to discover our current silhouettes.</p>
      </div>
    )
  }
  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
          saved={wishlist.includes(product.id)}
          onWishlist={onWishlist}
          onQuickView={onQuickView}
          currency={currency}
        />
      ))}
    </div>
  )
}

// Individual Product Card Component
function ProductCard({
  product,
  onAdd,
  saved,
  onWishlist,
  onQuickView,
  currency,
}: {
  product: Product
  onAdd: (product: Product, size: string, color?: string) => void
  saved: boolean
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  return (
    <article className="product-card group">
      <div className="product-image-wrap">
        <Link
          to={`/product/${product.id}`}
          className="product-image-link"
          aria-label={`View details for ${product.name}`}
        >
          <img
            className="product-image"
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
          <img
            className="product-image product-image-alt"
            src={product.alternate}
            alt={`${product.name} alternate view`}
            loading="lazy"
          />
        </Link>

        {product.badge && (
          <span
            className={`product-badge ${
              product.badge === 'Archive' ? 'badge-sale' : ''
            }`}
          >
            {product.badge}
          </span>
        )}

        <button
          className={`wishlist-button ${saved ? 'is-saved' : ''}`}
          onClick={() => onWishlist(product)}
          aria-label={
            saved
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={saved}
        >
          <Heart size={17} strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} />
        </button>

        <div className="quick-add">
          <button
            type="button"
            className="flex-1 py-1 text-center hover:underline"
            onClick={() => onAdd(product, product.sizes[0], product.colorName)}
          >
            Quick Add ({product.sizes[0]})
          </button>
          <button
            type="button"
            className="p-1 hover:text-white/80"
            onClick={() => onQuickView(product)}
            title="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="product-meta">
        <div>
          <Link to={`/product/${product.id}`} className="product-name">
            {product.name}
          </Link>
          <span className="product-type">
            {product.category} · {product.type}
          </span>
        </div>
        <div className="product-prices">
          <span className={product.oldPrice ? 'sale-price' : ''}>
            {money(product.price, currency)}
          </span>
          {product.oldPrice && <del>{money(product.oldPrice, currency)}</del>}
        </div>
      </div>

      {/* Swatches */}
      <div className="product-colour">
        <span className="colour-dot" style={{ backgroundColor: product.color }} />
        <span>{product.colorName}</span>
        {product.colorVariants.length > 1 && (
          <span className="text-xs text-[#8C7D70]">
            (+{product.colorVariants.length - 1})
          </span>
        )}
      </div>
    </article>
  )
}

// Quick View Modal Component
function QuickViewModal({
  product,
  onClose,
  onAdd,
  saved,
  onWishlist,
  currency,
}: {
  product: Product
  onClose: () => void
  onAdd: (product: Product, size: string, color?: string) => void
  saved: boolean
  onWishlist: (product: Product) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colorName)

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="size-guide-modal max-w-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[3/4] bg-[#EFECE6] overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col gap-4">
            <span className="eyebrow">{product.type}</span>
            <h2 className="text-2xl font-serif">{product.name}</h2>
            <div className="text-xl font-medium">{money(product.price, currency)}</div>
            <p className="text-sm text-[#555555] leading-relaxed">{product.description}</p>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#7E7870] block mb-2">
                Color: {selectedColor}
              </span>
              <div className="flex gap-2">
                {product.colorVariants.map((variant) => (
                  <button
                    key={variant.name}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      selectedColor === variant.name ? 'border-[#171717] scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: variant.hex }}
                    onClick={() => setSelectedColor(variant.name)}
                    title={variant.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#7E7870] block mb-2">
                Select Size
              </span>
              <div className="flex gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`flex-1 py-2 border text-sm font-medium ${
                      selectedSize === sz ? 'bg-[#171717] text-white border-[#171717]' : 'border-[#E7E3DC]'
                    }`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className="button button-dark flex-1"
                onClick={() => {
                  onAdd(product, selectedSize, selectedColor)
                  onClose()
                }}
              >
                Add to Bag · {money(product.price, currency)}
              </button>
              <button
                className={`p-3 border border-[#E7E3DC] ${saved ? 'text-red-600' : ''}`}
                onClick={() => onWishlist(product)}
                aria-label="Wishlist"
              >
                <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="underlined-link text-xs self-start mt-2"
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Collection Listing Page
type ListingMode = 'new' | 'Women' | 'Men'

function CollectionPage({
  title,
  eyebrow,
  description,
  mode,
  onAdd,
  wishlist,
  onWishlist,
  onQuickView,
  currency,
}: {
  title: string
  eyebrow: string
  description: string
  mode?: ListingMode
  onAdd: (product: Product, size: string, color?: string) => void
  wishlist: string[]
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [type, setType] = useState(searchParams.get('category') ?? 'All Pieces')
  const [size, setSize] = useState(searchParams.get('size') ?? '')
  const [color, setColor] = useState(searchParams.get('color') ?? '')
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('max') ?? 20000))
  const [sort, setSort] = useState('featured')

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      if (mode === 'new') return product.badge === 'New'
      if (mode === 'Women') return product.category === 'Women' || product.category === 'Unisex'
      if (mode === 'Men') return product.category === 'Men' || product.category === 'Unisex'
      return true
    })

    if (type !== 'All Pieces') result = result.filter((p) => p.type === type)
    if (size) result = result.filter((p) => p.sizes.includes(size))
    if (color) {
      result = result.filter((p) =>
        p.colorName.toLowerCase().includes(color.toLowerCase()),
      )
    }
    result = result.filter((p) => p.price <= maxPrice)

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sort === 'newest') result.sort((a, b) => Number(b.id) - Number(a.id))
    if (sort === 'popular') result.sort((a, b) => b.popularity - a.popularity)

    return result
  }, [color, maxPrice, mode, size, sort, type])

  const clearFilters = () => {
    setType('All Pieces')
    setSize('')
    setColor('')
    setMaxPrice(20000)
    setSearchParams({})
  }

  return (
    <div className="listing-page section-wrap">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{title}</span>
      </div>

      <div className="listing-title">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>
            {title}
            <em>.</em>
          </h1>
        </div>
        <p>{description}</p>
      </div>

      <div className="listing-toolbar">
        <button
          className="filter-toggle"
          onClick={() => setFilterOpen((open) => !open)}
          aria-expanded={filterOpen}
        >
          <SlidersHorizontal size={15} /> Filter &amp; Sort
          <span className="filter-count">
            {[type !== 'All Pieces', Boolean(size), Boolean(color), maxPrice < 20000].filter(
              Boolean,
            ).length || ''}
          </span>
        </button>

        <span className="result-count">{filtered.length} considered pieces</span>

        <label className="sort-control">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured Curations</option>
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </label>
      </div>

      {filterOpen && (
        <div className="filter-panel">
          <label>
            Category
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option>All Pieces</option>
              {['Tailoring', 'Shirts', 'Trousers', 'Knitwear', 'Outerwear', 'Accessories', 'Dresses'].map(
                (v) => (
                  <option key={v}>{v}</option>
                ),
              )}
            </select>
          </label>

          <label>
            Size
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              <option value="">All Sizes</option>
              {['XS', 'S', 'M', 'L', 'XL', 'One size'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            Colorway
            <select value={color} onChange={(event) => setColor(event.target.value)}>
              <option value="">All Colours</option>
              {[...new Set(products.map((p) => p.colorName))].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="price-filter">
            Price up to <strong>{money(maxPrice, currency)}</strong>
            <input
              type="range"
              min="1990"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </label>

          <button className="clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}

      <ProductGrid
        items={filtered}
        onAdd={onAdd}
        wishlist={wishlist}
        onWishlist={onWishlist}
        onQuickView={onQuickView}
        currency={currency}
      />
    </div>
  )
}

// Search Page
function SearchPage({
  onAdd,
  wishlist,
  onWishlist,
  onQuickView,
  currency,
}: {
  onAdd: (product: Product, size: string, color?: string) => void
  wishlist: string[]
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)

  const results = products.filter((product) =>
    `${product.name} ${product.type} ${product.category} ${product.colorName} ${product.description} ${product.material}`
      .toLowerCase()
      .includes(submittedQuery.toLowerCase()),
  )

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedQuery(query.trim())
    setSearchParams(query.trim() ? { q: query.trim() } : {})
  }

  return (
    <div className="search-page section-wrap py-12">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Search</span>
      </div>

      <span className="eyebrow">Studio Search</span>
      <h1 className="text-4xl font-serif mb-6">Discover the Collection.</h1>

      <form className="flex gap-3 max-w-xl mb-8" onSubmit={submit}>
        <div className="flex-1 flex items-center bg-white border border-[#E7E3DC] px-4 py-3">
          <Search size={20} className="text-[#555555] mr-3" />
          <input
            autoFocus
            className="w-full bg-transparent outline-none text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'blazer', 'wool coat', 'chalk white'..."
          />
        </div>
        <button className="button button-dark" type="submit">
          Search
        </button>
      </form>

      {/* Suggested quick tags */}
      <div className="flex flex-wrap items-center gap-2 mb-10 text-xs">
        <span className="text-[#7E7870] uppercase tracking-wider">Trending searches:</span>
        {['Wool Blazer', 'Everyday Poplin', 'Wide Trouser', 'Merino Knit', 'Tote Bag'].map(
          (tag) => (
            <button
              key={tag}
              className="bg-[#EAE6DF] hover:bg-[#D9D5CE] px-3 py-1.5 transition-colors"
              onClick={() => {
                setQuery(tag)
                setSubmittedQuery(tag)
                setSearchParams({ q: tag })
              }}
            >
              {tag}
            </button>
          ),
        )}
      </div>

      {submittedQuery && (
        <p className="text-sm text-[#555555] mb-6">
          Showing {results.length} {results.length === 1 ? 'piece' : 'pieces'} matching “
          {submittedQuery}”
        </p>
      )}

      {results.length ? (
        <ProductGrid
          items={results}
          onAdd={onAdd}
          wishlist={wishlist}
          onWishlist={onWishlist}
          onQuickView={onQuickView}
          currency={currency}
        />
      ) : (
        <div className="empty-state">
          <span className="eyebrow">No Direct Matches</span>
          <p>We could not find anything matching “{submittedQuery}”. Explore our full edit.</p>
          <Link to="/shop" className="button button-dark">
            Explore All Pieces <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  )
}

// Product Details Page (PDP)
function ProductPage({
  onAdd,
  wishlist,
  onWishlist,
  currency,
}: {
  onAdd: (product: Product, size: string, color?: string, quantity?: number) => void
  wishlist: string[]
  onWishlist: (product: Product) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  const { productId } = useParams()
  const product = products.find((item) => item.id === productId)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState('')
  const [guideOpen, setGuideOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (product) {
      setSize(product.sizes[0] || '')
      setColor(product.colorName)
      setActiveImage(0)
    }
  }, [product])

  if (!product) return <NotFound />

  const images = product.gallery || [product.image, product.alternate]

  const handleAdd = () => {
    if (!size) {
      setSizeError('Please choose a size before adding to your bag.')
      return
    }
    setSizeError('')
    onAdd(product, size, color, quantity)
  }

  const related = products
    .filter((item) => item.id !== product.id && item.type === product.type)
    .slice(0, 4)

  const isSaved = wishlist.includes(product.id)

  return (
    <div className="product-detail-page section-wrap">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/${product.category.toLowerCase()}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="detail-main-image">
            <img
              src={images[activeImage]}
              alt={`${product.name} view ${activeImage + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          <div className="detail-thumbnails">
            {images.map((src, index) => (
              <button
                key={src}
                onClick={() => setActiveImage(index)}
                className={activeImage === index ? 'active' : ''}
                aria-label={`Show view ${index + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info & Purchase */}
        <div className="detail-info">
          <span className="eyebrow">
            {product.category} · {product.type}
          </span>
          <h1>{product.name}</h1>

          <div className="detail-price">
            <span className={product.oldPrice ? 'sale-price' : ''}>
              {money(product.price, currency)}
            </span>
            {product.oldPrice && <del>{money(product.oldPrice, currency)}</del>}
          </div>

          <p className="detail-description">{product.description}</p>

          {/* Color Variants */}
          <div className="mb-6">
            <div className="detail-colour-line mb-3">
              <span className="colour-dot" style={{ backgroundColor: product.color }} />
              <span>
                Selected Colourway: <strong>{color}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              {product.colorVariants.map((v) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setColor(v.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === v.name ? 'border-[#171717] scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: v.hex }}
                  title={v.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="size-label-row">
            <span>Size</span>
            <button className="text-button flex items-center gap-1" onClick={() => setGuideOpen(true)}>
              <HelpCircle size={14} /> Size Guide
            </button>
          </div>

          <div className="size-options">
            {product.sizes.map((val) => (
              <button
                key={val}
                className={size === val ? 'selected' : ''}
                onClick={() => {
                  setSize(val)
                  setSizeError('')
                }}
              >
                {val}
              </button>
            ))}
          </div>
          {sizeError && (
            <p className="text-xs text-red-600 mb-4" role="alert">
              {sizeError}
            </p>
          )}

          {/* Quantity Stepper */}
          <div className="detail-quantity">
            <span>Quantity</span>
            <div className="quantity-control">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((v) => Math.max(1, v - 1))}
              >
                <Minus size={13} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((v) => v + 1)}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="detail-cta-row">
            <button className="button button-dark add-to-bag" onClick={handleAdd}>
              Add to Bag — {money(product.price * quantity, currency)} <ArrowRight size={16} />
            </button>
            <button
              className={`detail-wishlist ${isSaved ? 'is-saved' : ''}`}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              onClick={() => onWishlist(product)}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Shipping Assurance */}
          <div className="delivery-note">
            <Truck size={22} className="text-[#8C7D70] shrink-0" />
            <div>
              <strong>Complimentary Studio Shipping</strong>
              <p>
                Included on all orders above ₹4,999. Carbon-neutral delivery with 14-day
                complimentary studio exchanges.
              </p>
            </div>
          </div>

          {/* Accordions */}
          <div className="detail-accordions">
            <details open>
              <summary>
                Silhouette &amp; Tailoring <ChevronDown size={16} />
              </summary>
              <ul className="list-disc pl-5 space-y-1">
                {product.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>

            <details>
              <summary>
                Material &amp; Care <ChevronDown size={16} />
              </summary>
              <div className="space-y-2">
                <p>
                  <strong>Composition:</strong> {product.material}
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {product.care.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details>
              <summary>
                Complimentary Delivery &amp; Returns <ChevronDown size={16} />
              </summary>
              <p>
                Orders placed before 2:00 PM IST dispatch the same studio day. International shipping
                is tracked door-to-door via DHL Express. Hassle-free return pickups available in all
                major metros.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {guideOpen && <SizeGuide onClose={() => setGuideOpen(false)} />}

      {/* Related Products */}
      <section className="related-products pt-12 border-t border-[#E7E3DC]">
        <div className="section-heading-inline">
          <SectionHeading
            eyebrow="Pairings"
            title={
              <>
                You May Also <em>Consider.</em>
              </>
            }
          />
        </div>
        <ProductGrid
          items={
            related.length
              ? related
              : products.filter((p) => p.id !== product.id).slice(0, 4)
          }
          onAdd={onAdd}
          wishlist={wishlist}
          onWishlist={onWishlist}
          onQuickView={() => {}}
          currency={currency}
        />
      </section>
    </div>
  )
}

// Size Guide Modal
function SizeGuide({ onClose }: { onClose: () => void }) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="size-guide-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="icon-button modal-close" aria-label="Close" onClick={onClose}>
          <X size={20} />
        </button>

        <span className="eyebrow">Studio Fit Standards</span>
        <h2 id="size-guide-title" className="text-2xl font-serif">
          Garment Measurements
        </h2>
        <p className="text-sm text-[#555555] mt-2 mb-4">
          All silhouettes are engineered with relaxed, architectural proportions. Choose your
          standard size for the intended relaxed drape.
        </p>

        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1 text-xs uppercase font-medium border ${
              unit === 'cm' ? 'bg-[#171717] text-white border-[#171717]' : 'border-[#E7E3DC]'
            }`}
            onClick={() => setUnit('cm')}
          >
            Centimetres (cm)
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase font-medium border ${
              unit === 'in' ? 'bg-[#171717] text-white border-[#171717]' : 'border-[#E7E3DC]'
            }`}
            onClick={() => setUnit('in')}
          >
            Inches (in)
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Size</th>
              <th>Bust / Chest</th>
              <th>Waist</th>
              <th>Low Hip</th>
              <th>Sleeve Length</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>XS</th>
              <td>{unit === 'cm' ? '82–86 cm' : '32–34 in'}</td>
              <td>{unit === 'cm' ? '64–68 cm' : '25–27 in'}</td>
              <td>{unit === 'cm' ? '88–92 cm' : '34–36 in'}</td>
              <td>{unit === 'cm' ? '61 cm' : '24.0 in'}</td>
            </tr>
            <tr>
              <th>S</th>
              <td>{unit === 'cm' ? '86–92 cm' : '34–36 in'}</td>
              <td>{unit === 'cm' ? '68–74 cm' : '27–29 in'}</td>
              <td>{unit === 'cm' ? '92–98 cm' : '36–38 in'}</td>
              <td>{unit === 'cm' ? '62 cm' : '24.4 in'}</td>
            </tr>
            <tr>
              <th>M</th>
              <td>{unit === 'cm' ? '92–98 cm' : '36–39 in'}</td>
              <td>{unit === 'cm' ? '74–80 cm' : '29–31 in'}</td>
              <td>{unit === 'cm' ? '98–104 cm' : '38–41 in'}</td>
              <td>{unit === 'cm' ? '63 cm' : '24.8 in'}</td>
            </tr>
            <tr>
              <th>L</th>
              <td>{unit === 'cm' ? '98–106 cm' : '39–42 in'}</td>
              <td>{unit === 'cm' ? '80–88 cm' : '31–35 in'}</td>
              <td>{unit === 'cm' ? '104–112 cm' : '41–44 in'}</td>
              <td>{unit === 'cm' ? '64 cm' : '25.2 in'}</td>
            </tr>
            <tr>
              <th>XL</th>
              <td>{unit === 'cm' ? '106–114 cm' : '42–45 in'}</td>
              <td>{unit === 'cm' ? '88–96 cm' : '35–38 in'}</td>
              <td>{unit === 'cm' ? '112–120 cm' : '44–47 in'}</td>
              <td>{unit === 'cm' ? '65 cm' : '25.6 in'}</td>
            </tr>
          </tbody>
        </table>

        <button className="button button-dark w-full mt-4" onClick={onClose}>
          Return to Piece
        </button>
      </section>
    </div>
  )
}

// Slide-out Shopping Bag Drawer
function BagDrawer({
  bag,
  onChange,
  onClose,
  currency,
}: {
  bag: BagItem[]
  onChange: (key: string, quantity: number) => void
  onClose: () => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  const navigate = useNavigate()
  const items = bag
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item): item is BagItem & { product: Product } => Boolean(item.product))

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const freeShippingThreshold = 4999
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  return (
    <div className="modal-backdrop z-[110]" onClick={onClose}>
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white p-6 shadow-2xl flex flex-col z-[120] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-[#E7E3DC]">
          <span className="font-serif text-2xl font-light">Shopping Bag ({items.length})</span>
          <button className="icon-button" onClick={onClose} aria-label="Close bag">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="py-4 border-b border-[#E7E3DC] text-xs">
          {subtotal >= freeShippingThreshold ? (
            <p className="text-green-700 font-medium flex items-center gap-1.5">
              <Check size={14} /> You have unlocked complimentary studio shipping!
            </p>
          ) : (
            <p className="text-[#555555]">
              Add <strong>{money(freeShippingThreshold - subtotal, currency)}</strong> more for
              complimentary shipping.
            </p>
          )}
          <div className="w-full bg-[#EAE6DF] h-1.5 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-[#171717] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bag Items */}
        <div className="flex-1 py-4 flex flex-col gap-4 overflow-y-auto">
          {items.length ? (
            items.map(({ key, product, size, color, quantity }) => (
              <div key={key} className="flex gap-4 pb-4 border-b border-[#E7E3DC]/60">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover bg-[#EFECE6]"
                />
                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-medium text-sm text-[#171717]">{product.name}</h4>
                    <span className="text-[#7E7870]">
                      {color} · Size: {size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="quantity-control scale-90 -ml-2">
                      <button onClick={() => onChange(key, quantity - 1)}>
                        <Minus size={11} />
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => onChange(key, quantity + 1)}>
                        <Plus size={11} />
                      </button>
                    </div>
                    <span className="font-medium">{money(product.price * quantity, currency)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-sm text-[#7E7870]">
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-40" />
              Your shopping bag is empty.
            </div>
          )}
        </div>

        {/* Subtotal & Buttons */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-[#E7E3DC] space-y-3">
            <div className="flex justify-between font-serif text-lg">
              <span>Subtotal</span>
              <span>{money(subtotal, currency)}</span>
            </div>
            <p className="text-[11px] text-[#7E7870]">
              Taxes calculated at checkout. Complimentary returns within 14 days.
            </p>
            <button
              className="button button-dark w-full"
              onClick={() => {
                onClose()
                navigate('/checkout')
              }}
            >
              Proceed to Checkout · {money(subtotal, currency)}
            </button>
            <button
              className="text-xs uppercase tracking-widest text-[#7E7870] hover:text-[#171717] block w-full text-center py-1"
              onClick={() => {
                onClose()
                navigate('/bag')
              }}
            >
              View Full Bag Details
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

// Shopping Bag Full Page
function BagPage({
  bag,
  onChange,
  currency,
}: {
  bag: BagItem[]
  onChange: (key: string, quantity: number) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')

  const items = bag
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item): item is BagItem & { product: Product } => Boolean(item.product))

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const isFreeDelivery = subtotal >= 4999
  const deliveryFee = isFreeDelivery || subtotal === 0 ? 0 : 250
  const total = Math.max(0, subtotal + deliveryFee - promoDiscount)

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === 'STUDIO10') {
      setPromoDiscount(Math.round(subtotal * 0.1))
      setPromoMessage('10% Studio Welcome discount applied.')
    } else {
      setPromoMessage('Invalid voucher code. Try "STUDIO10"')
    }
  }

  return (
    <div className="section-wrap bag-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Shopping Bag</span>
      </div>

      <span className="eyebrow">Your Selection</span>
      <h1 className="text-4xl font-serif mb-6">Shopping Bag ({items.length})</h1>

      {items.length ? (
        <div className="bag-layout">
          <div className="bag-items">
            {items.map(({ key, product, size, color, quantity }) => (
              <article className="bag-item" key={key}>
                <Link to={`/product/${product.id}`} className="bag-item-image">
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="bag-item-info">
                  <Link to={`/product/${product.id}`} className="bag-item-name">
                    {product.name}
                  </Link>
                  <span>Colour: {color}</span>
                  <span>Size: {size}</span>
                  <button className="remove-item" onClick={() => onChange(key, 0)}>
                    Remove piece
                  </button>
                </div>
                <div className="bag-item-end">
                  <strong>{money(product.price * quantity, currency)}</strong>
                  <div className="quantity-control">
                    <button
                      aria-label="Decrease"
                      onClick={() => onChange(key, quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      aria-label="Increase"
                      onClick={() => onChange(key, quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <Link className="underlined-link text-xs mt-4 self-start" to="/shop">
              <ArrowLeft size={14} /> Continue Exploring
            </Link>
          </div>

          <aside className="order-summary">
            <span className="eyebrow">Order Overview</span>
            <h2>Summary</h2>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>{money(subtotal, currency)}</span>
            </div>

            <div className="summary-line">
              <span>Delivery</span>
              <span>{isFreeDelivery ? 'Complimentary' : money(deliveryFee, currency)}</span>
            </div>

            {promoDiscount > 0 && (
              <div className="summary-line text-green-700">
                <span>Voucher (STUDIO10)</span>
                <span>-{money(promoDiscount, currency)}</span>
              </div>
            )}

            <div className="summary-line summary-total">
              <strong>Estimated Total</strong>
              <strong>{money(total, currency)}</strong>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="my-4 flex gap-2">
              <input
                className="flex-1 border border-[#E7E3DC] p-2 text-xs uppercase"
                placeholder="PROMO CODE (TRY STUDIO10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button className="button button-dark py-2 px-3 text-xs" type="submit">
                Apply
              </button>
            </form>
            {promoMessage && (
              <p className="text-xs text-[#8C7D70] mb-4">{promoMessage}</p>
            )}

            <Link to="/checkout" className="button button-dark checkout-button">
              Proceed to Checkout · {money(total, currency)} <ArrowRight size={16} />
            </Link>

            <div className="payment-note">
              Complimentary 14-day studio returns · Tax included
            </div>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={32} strokeWidth={1.2} />
          <span className="eyebrow">Empty Bag</span>
          <p>Your shopping bag is currently quiet. Find something that speaks to you.</p>
          <Link className="button button-dark" to="/shop">
            Explore the Collection <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  )
}

// Multi-Step Checkout Page
function CheckoutPage({
  bag,
  currency,
  onOrderPlaced,
}: {
  bag: BagItem[]
  currency: 'INR' | 'USD' | 'EUR'
  onOrderPlaced: (order: OrderRecord) => void
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [fullName, setFullName] = useState('Priya Sharma')
  const [email, setEmail] = useState('priya.sharma@example.com')
  const [phone, setPhone] = useState('+91 98110 24890')
  const [address, setAddress] = useState('42 Kasturba Gandhi Marg, Connaught Place')
  const [city, setCity] = useState('New Delhi')
  const [pin, setPin] = useState('110001')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null)
  const [error, setError] = useState('')

  const items = bag
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item): item is BagItem & { product: Product } => Boolean(item.product))

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const delivery = subtotal >= 4999 ? 0 : 250
  const total = subtotal + delivery

  const handleStep1 = (e: FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim() || !pin.trim()) {
      setError('Please fill in all delivery details.')
      return
    }
    setError('')
    setStep(2)
  }

  const handleFinalOrder = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const newOrder: OrderRecord = {
        id: `MS-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        customerName: fullName,
        email,
        address: `${address}, ${city} - ${pin}`,
        items: items.map((i) => ({
          product: i.product,
          size: i.size,
          quantity: i.quantity,
        })),
        total,
        status: 'Processing',
      }
      onOrderPlaced(newOrder)
      setPlacedOrder(newOrder)
      setIsSubmitting(false)
    }, 1200)
  }

  if (placedOrder) {
    return (
      <div className="section-wrap checkout-page">
        <div className="checkout-success">
          <span className="success-icon">
            <Check size={28} />
          </span>
          <span className="eyebrow">Studio Order Confirmed</span>
          <h1>Thank you, {placedOrder.customerName.split(' ')[0]}.</h1>
          <p className="text-sm text-[#555555]">
            Your order <strong>{placedOrder.id}</strong> has been logged into our atelier dispatch
            system. A copy of your considered receipt has been generated.
          </p>

          <div className="bg-[#FAF8F5] border border-[#E7E3DC] p-4 text-left my-6 text-xs space-y-2">
            <div className="flex justify-between font-semibold border-b border-[#E7E3DC] pb-2">
              <span>Order Reference: {placedOrder.id}</span>
              <span>{placedOrder.date}</span>
            </div>
            <div>
              <strong>Delivery Address:</strong> {placedOrder.address}
            </div>
            <div>
              <strong>Items:</strong>
              <ul className="list-disc pl-5 mt-1">
                {placedOrder.items.map((it, idx) => (
                  <li key={idx}>
                    {it.product.name} (Size {it.size}) × {it.quantity} —{' '}
                    {money(it.product.price * it.quantity, currency)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-[#E7E3DC] font-semibold flex justify-between">
              <span>Total Paid (Test Mode):</span>
              <span>{money(placedOrder.total, currency)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/account" className="button button-dark">
              View Order in Account
            </Link>
            <Link to="/shop" className="button button-light">
              Return to Collection
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-wrap checkout-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/bag">Bag</Link>
        <span>/</span>
        <span>Checkout</span>
      </div>

      <span className="eyebrow">Studio Dispatch</span>
      <h1 className="text-3xl font-serif mb-4">Complete Your Order</h1>

      <div className="checkout-notice">
        <span>TEST INTEGRATION · ATELIER SANDBOX</span>
        <p>
          This is a fully functional test checkout simulating PCI-compliant gateway processing. No
          real currency will be debited.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-4 mb-8 text-xs uppercase tracking-widest text-[#7E7870]">
        <span className={step === 1 ? 'font-bold text-[#171717] underline' : ''}>
          01. Delivery Details
        </span>
        <span>→</span>
        <span className={step === 2 ? 'font-bold text-[#171717] underline' : ''}>
          02. Payment &amp; Review
        </span>
      </div>

      {step === 1 ? (
        <form className="checkout-form" onSubmit={handleStep1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              Full Name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
            <label>
              Email Address (For receipt)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <label>
            Mobile Contact Number
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>

          <label>
            Delivery Street Address
            <input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label>
              City
              <input value={city} onChange={(e) => setCity(e.target.value)} required />
            </label>
            <label>
              PIN / Postal Code
              <input value={pin} onChange={(e) => setPin(e.target.value)} required />
            </label>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button className="button button-dark" type="submit">
            Continue to Payment Method <ArrowRight size={16} />
          </button>
        </form>
      ) : (
        <form className="checkout-form" onSubmit={handleFinalOrder}>
          <div className="bg-white border border-[#E7E3DC] p-4 text-xs space-y-1 mb-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E7E3DC]">
              <strong>Shipping Destination:</strong>
              <button
                type="button"
                className="text-button text-xs"
                onClick={() => setStep(1)}
              >
                Edit
              </button>
            </div>
            <p>
              {fullName} · {email} · {phone}
            </p>
            <p>
              {address}, {city} - {pin}
            </p>
          </div>

          <div className="space-y-3">
            <span className="eyebrow">Select Payment Method (Test Mode)</span>

            <label
              className={`flex items-center gap-3 p-4 border cursor-pointer ${
                paymentMethod === 'card' ? 'border-[#171717] bg-[#FAF8F5]' : 'border-[#E7E3DC]'
              }`}
            >
              <input
                type="radio"
                name="pm"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <CreditCard size={18} />
              <div>
                <strong>Credit / Debit Card (Sandbox)</strong>
                <span className="block text-xs text-[#7E7870]">
                  Visa, Mastercard, Amex, RuPay (Simulated test gateway)
                </span>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 p-4 border cursor-pointer ${
                paymentMethod === 'upi' ? 'border-[#171717] bg-[#FAF8F5]' : 'border-[#E7E3DC]'
              }`}
            >
              <input
                type="radio"
                name="pm"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
              />
              <Sparkles size={18} />
              <div>
                <strong>Instant UPI / QR</strong>
                <span className="block text-xs text-[#7E7870]">
                  Google Pay, PhonePe, Paytm, BHIM
                </span>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 p-4 border cursor-pointer ${
                paymentMethod === 'cod' ? 'border-[#171717] bg-[#FAF8F5]' : 'border-[#E7E3DC]'
              }`}
            >
              <input
                type="radio"
                name="pm"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <ShieldCheck size={18} />
              <div>
                <strong>Cash on Studio Delivery</strong>
                <span className="block text-xs text-[#7E7870]">
                  Pay upon doorstep inspection
                </span>
              </div>
            </label>
          </div>

          <div className="bg-[#FAF8F5] p-4 text-xs space-y-2 border border-[#E7E3DC] mt-4">
            <div className="flex justify-between">
              <span>Items Total ({items.length})</span>
              <span>{money(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Studio Shipping</span>
              <span>{delivery === 0 ? 'Complimentary' : money(delivery, currency)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#E7E3DC]">
              <span>Final Amount</span>
              <span>{money(total, currency)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="button button-light flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="button button-dark flex-1"
            >
              {isSubmitting ? 'Confirming with Studio...' : `Authorize Demo Order · ${money(total, currency)}`}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// Wishlist Page
function WishlistPage({
  wishlist,
  onWishlist,
  onAdd,
  currency,
}: {
  wishlist: string[]
  onWishlist: (product: Product) => void
  onAdd: (product: Product, size: string, color?: string) => void
  currency: 'INR' | 'USD' | 'EUR'
}) {
  const saved = products.filter((p) => wishlist.includes(p.id))

  return (
    <div className="section-wrap py-12">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Wishlist</span>
      </div>

      <span className="eyebrow">Private Curation</span>
      <h1 className="text-4xl font-serif mb-6">Saved Pieces ({saved.length})</h1>

      {saved.length ? (
        <ProductGrid
          items={saved}
          onAdd={onAdd}
          wishlist={wishlist}
          onWishlist={onWishlist}
          onQuickView={() => {}}
          currency={currency}
        />
      ) : (
        <div className="empty-state">
          <Heart size={30} strokeWidth={1.2} />
          <span className="eyebrow">No Saved Pieces</span>
          <p>You haven’t saved any pieces to your wishlist yet.</p>
          <Link to="/shop" className="button button-dark">
            Explore the Collection <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  )
}

// Customer Account Page
function AccountPage({
  orders,
  wishlistCount,
  currency,
}: {
  orders: OrderRecord[]
  wishlistCount: number
  currency: 'INR' | 'USD' | 'EUR'
}) {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders')

  return (
    <div className="section-wrap py-12 max-w-4xl">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Studio Account</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E7E3DC]">
        <div>
          <span className="eyebrow">Client Portal</span>
          <h1 className="text-3xl font-serif">Welcome, Priya.</h1>
          <p className="text-xs text-[#7E7870]">Client ID: MS-VIP-092 · Studio Member since 2024</p>
          <Link to="/wishlist" className="mt-2 inline-flex text-xs text-[#7E7870] hover:text-[#171717]">
            Saved Pieces ({wishlistCount}) →
          </Link>
        </div>
        <Link to="/admin" className="text-xs uppercase tracking-widest text-[#8C7D70] hover:text-[#171717] mt-3 md:mt-0 flex items-center gap-1">
          <Settings size={14} /> Open Studio SaaS Merchant Suite →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#E7E3DC] mb-8 text-xs uppercase tracking-widest">
        <button
          className={`pb-3 font-medium ${
            activeTab === 'orders' ? 'border-b-2 border-[#171717] text-[#171717]' : 'text-[#7E7870]'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Recent Orders ({orders.length})
        </button>
        <button
          className={`pb-3 font-medium ${
            activeTab === 'addresses' ? 'border-b-2 border-[#171717] text-[#171717]' : 'text-[#7E7870]'
          }`}
          onClick={() => setActiveTab('addresses')}
        >
          Delivery Addresses (2)
        </button>
        <button
          className={`pb-3 font-medium ${
            activeTab === 'profile' ? 'border-b-2 border-[#171717] text-[#171717]' : 'text-[#7E7870]'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Client Preferences
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#E7E3DC] p-6 text-sm">
              <div className="flex flex-wrap justify-between items-center pb-4 border-b border-[#E7E3DC] gap-2">
                <div>
                  <strong className="text-base font-serif">{order.id}</strong>
                  <span className="text-xs text-[#7E7870] ml-3">Placed on {order.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs bg-[#EAE6DF] font-medium tracking-wider uppercase">
                    {order.status}
                  </span>
                  <span className="font-semibold">{money(order.total, currency)}</span>
                </div>
              </div>

              <div className="py-4 space-y-3">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      className="w-14 h-16 object-cover bg-[#EFECE6]"
                    />
                    <div className="flex-1 text-xs">
                      <strong className="text-sm block">{it.product.name}</strong>
                      <span className="text-[#7E7870]">
                        Size: {it.size} · Quantity: {it.quantity}
                      </span>
                    </div>
                    <span className="text-xs font-medium">
                      {money(it.product.price * it.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E7E3DC] text-xs text-[#7E7870] flex justify-between items-center">
                <span>Shipped to: {order.address}</span>
                <button className="underlined-link text-[11px]" onClick={() => alert('Tracking: In transit via DHL Air Express. Estimated delivery tomorrow.')}>
                  Track Consignment →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border-2 border-[#171717] p-5 text-xs relative">
            <span className="absolute top-4 right-4 bg-[#171717] text-white px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold">
              Default
            </span>
            <strong className="text-sm block mb-1">New Delhi Atelier</strong>
            <p className="text-[#555555] leading-relaxed">
              Priya Sharma
              <br />
              42 Kasturba Gandhi Marg, Connaught Place
              <br />
              New Delhi, Delhi 110001
              <br />
              Phone: +91 98110 24890
            </p>
          </div>

          <div className="bg-white border border-[#E7E3DC] p-5 text-xs">
            <strong className="text-sm block mb-1">Mumbai Residence</strong>
            <p className="text-[#555555] leading-relaxed">
              Priya Sharma
              <br />
              Apt 14B, Altamount Road, Cumballa Hill
              <br />
              Mumbai, Maharashtra 400026
              <br />
              Phone: +91 98200 11928
            </p>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white border border-[#E7E3DC] p-6 max-w-lg text-sm space-y-4">
          <h3 className="font-serif text-lg">Studio Correspondence</h3>
          <label className="flex items-center gap-3 text-xs">
            <input type="checkbox" defaultChecked />
            Receive private capsule invitations and editorial previews.
          </label>
          <label className="flex items-center gap-3 text-xs">
            <input type="checkbox" defaultChecked />
            Receive order tracking notifications via SMS and WhatsApp.
          </label>
          <button className="button button-dark text-xs py-2 px-4 mt-2">
            Save Preferences
          </button>
        </div>
      )}
    </div>
  )
}

// Studio SaaS Readiness & Admin Suite (Section 7 of prompt)
function AdminSuitePage({
  orders,
  currency,
  onUpdateOrderStatus,
}: {
  orders: OrderRecord[]
  currency: 'INR' | 'USD' | 'EUR'
  onUpdateOrderStatus: (id: string, status: 'Processing' | 'Dispatched' | 'Delivered') => void
}) {
  const [activeTheme, setActiveTheme] = useState<'Warm Ivory' | 'Noir Minimalist' | 'Slate Nordic'>('Warm Ivory')

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const averageOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0

  return (
    <div className="section-wrap py-12">
      <div className="breadcrumbs">
        <Link to="/">Storefront</Link>
        <span>/</span>
        <span>SaaS Merchant Suite</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#E7E3DC] gap-4">
        <div>
          <span className="admin-badge">
            <Sparkles size={12} /> SaaS Merchant Platform Architecture
          </span>
          <h1 className="text-3xl font-serif mt-2">MONOCHROME STUDIO — Atelier Suite</h1>
          <p className="text-xs text-[#7E7870]">
            Multi-brand headless infrastructure, inventory controls, order pipelines &amp; analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs uppercase text-[#7E7870]">Brand Theme:</span>
          <select
            className="border border-[#E7E3DC] bg-white p-2 text-xs"
            value={activeTheme}
            onChange={(e) => setActiveTheme(e.target.value as any)}
          >
            <option>Warm Ivory</option>
            <option>Noir Minimalist</option>
            <option>Slate Nordic</option>
          </select>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <span>Gross Revenue</span>
          <strong>{money(totalRevenue + 842000, currency)}</strong>
          <small className="text-xs text-green-700 flex items-center gap-1">
            <TrendingUp size={12} /> +18.4% vs last month
          </small>
        </div>

        <div className="stat-card">
          <span>Total Orders</span>
          <strong>{orders.length + 68}</strong>
          <small className="text-xs text-[#7E7870]">98.2% fulfillment rate</small>
        </div>

        <div className="stat-card">
          <span>Average Order Value</span>
          <strong>{money(averageOrder || 9450, currency)}</strong>
          <small className="text-xs text-green-700">+8.1% basket size</small>
        </div>

        <div className="stat-card">
          <span>Active Inventory</span>
          <strong>{products.length} Silhouettes</strong>
          <small className="text-xs text-[#7E7870]">100% in stock</small>
        </div>
      </div>

      {/* Live Inventory Table */}
      <div className="bg-white border border-[#E7E3DC] p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-serif text-lg">Inventory &amp; Silhouette Allocation</h3>
            <span className="text-xs text-[#7E7870]">
              Real-time SKU availability across production studios
            </span>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#8C7D70]">
            {products.length} Live Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E7E3DC] text-[#7E7870] uppercase">
                <th className="py-2.5">Piece</th>
                <th>Category</th>
                <th>Price</th>
                <th>Units In Atelier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[#E7E3DC]/60 hover:bg-[#FAF8F5]">
                  <td className="py-2.5 font-medium flex items-center gap-2">
                    <img src={p.image} alt="" className="w-8 h-10 object-cover bg-[#EFECE6]" />
                    {p.name}
                  </td>
                  <td>{p.type}</td>
                  <td>{money(p.price, currency)}</td>
                  <td>{p.stockCount} units</td>
                  <td>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                        p.stockCount < 10
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-green-100 text-green-900'
                      }`}
                    >
                      {p.stockCount < 10 ? 'Low Stock' : 'Optimal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Management Pipeline */}
      <div className="bg-white border border-[#E7E3DC] p-6 mb-8">
        <h3 className="font-serif text-lg mb-4">Client Order Fulfillment Pipeline</h3>
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border border-[#E7E3DC] text-xs gap-3"
            >
              <div>
                <strong>{o.id}</strong> · {o.customerName} ({o.email})
                <div className="text-[#7E7870]">{o.items.length} items · {o.address}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold">{money(o.total, currency)}</span>
                <select
                  value={o.status}
                  onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                  className="border border-[#E7E3DC] p-1 bg-[#FAF8F5] text-xs font-medium"
                >
                  <option>Processing</option>
                  <option>Dispatched</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SaaS Tier Readiness (Addressing Section 7) */}
      <div className="bg-[#FAF8F5] border border-[#E7E3DC] p-6">
        <span className="eyebrow">Multi-Brand Architecture</span>
        <h3 className="font-serif text-xl mb-4">SaaS Merchant Subscription Plans</h3>
        <p className="text-xs text-[#555555] mb-6 max-w-xl">
          Monochrome Studio's codebase is designed for plug-and-play white-labeling, allowing
          independent luxury labels to deploy editorial storefronts with custom domains and inventory sync.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E7E3DC] p-4 text-xs">
            <strong className="block text-sm font-serif">Studio Starter</strong>
            <span className="text-lg font-medium block my-2">₹4,999 / mo</span>
            <ul className="space-y-1.5 text-[#555555]">
              <li>✓ Single boutique domain</li>
              <li>✓ Up to 50 active silhouettes</li>
              <li>✓ Standard headless checkout</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-[#171717] p-4 text-xs">
            <span className="bg-[#171717] text-white px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold">
              Popular
            </span>
            <strong className="block text-sm font-serif mt-1">Maison Growth</strong>
            <span className="text-lg font-medium block my-2">₹12,999 / mo</span>
            <ul className="space-y-1.5 text-[#555555]">
              <li>✓ Multi-currency (INR, USD, EUR)</li>
              <li>✓ Unlimited silhouettes &amp; variants</li>
              <li>✓ Automated DHL &amp; Bluedart tracking</li>
              <li>✓ Custom editorial theme engine</li>
            </ul>
          </div>

          <div className="bg-white border border-[#E7E3DC] p-4 text-xs">
            <strong className="block text-sm font-serif">Global Enterprise</strong>
            <span className="text-lg font-medium block my-2">Custom Atelier</span>
            <ul className="space-y-1.5 text-[#555555]">
              <li>✓ Multi-brand parent company support</li>
              <li>✓ Dedicated ERP &amp; SAP connectors</li>
              <li>✓ 99.99% SLA &amp; dedicated director</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Journal Page
function JournalPage() {
  const stories = [
    {
      id: 'personal-style',
      number: '01',
      title: 'The Beauty of Wearing What You Love',
      category: 'Personal Style',
      image: 'photo-1483985988355-763728e1935b',
      body: 'Personal style is less about having endless options and more about recognising the garments that let you feel like yourself. We return to our favourite sculpted blazer or crisp poplin shirt not because they are novelty, but because they carry quiet confidence.',
    },
    {
      id: 'wardrobe',
      number: '02',
      title: 'A Wardrobe With Room to Breathe',
      category: 'The Essentials',
      image: 'photo-1529139574466-a303027c1d8b',
      body: 'An edited clothing rail is a generous thing. When every piece has an architectural reason to exist, getting dressed in the morning shifts from routine friction into an intentional ritual of form and comfort.',
    },
    {
      id: 'design',
      number: '03',
      title: 'Finding Meaning in the Everyday',
      category: 'Modern Design',
      image: 'photo-1490481651871-ab68de25d43d',
      body: 'The subtle weight of a horn button, the internal binding of a seam, a welt pocket cut at the natural hand line. The greatest luxury of clothing often lives in the nuanced details you only notice after months of daily wear.',
    },
  ]

  return (
    <div className="journal-page section-wrap">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Journal</span>
      </div>

      <span className="eyebrow">Studio Notes &amp; Essays</span>
      <h1 className="text-4xl font-serif">From the Atelier.</h1>

      <div className="journal-articles">
        {stories.map((story) => (
          <article id={story.id} className="journal-article" key={story.id}>
            <div className="article-image">
              <img
                src={`https://images.unsplash.com/${story.image}?auto=format&fit=crop&w=1200&q=85`}
                alt=""
                loading="lazy"
              />
              <span>{story.number} / 03</span>
            </div>
            <div className="article-copy">
              <span className="eyebrow">{story.category}</span>
              <h2>{story.title}</h2>
              <p>{story.body}</p>
              <Link to="/shop" className="button button-dark">
                Shop the Editorial <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div id="studio-note" className="journal-signoff">
        <span className="eyebrow">A Note from the Studio</span>
        <p>
          MONOCHROME STUDIO is an ongoing exploration of considered essentials. Clothes made for
          living, built with intention, and designed to outlast the season.
        </p>
        <Link to="/shop" className="button button-dark">
          Discover the Collection <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}

// Not Found Page
function NotFound() {
  return (
    <div className="not-found section-wrap py-24 text-center">
      <span className="eyebrow">Out of Frame</span>
      <h1 className="text-5xl font-serif mb-4">
        This Silhouette
        <br />
        <em>Does Not Exist.</em>
      </h1>
      <p className="text-sm text-[#7E7870] mb-8">
        The link you followed may have moved or been retired to our studio archives.
      </p>
      <Link className="button button-dark" to="/">
        Return to the Studio <ArrowRight size={15} />
      </Link>
    </div>
  )
}

// Premium Studio Footer
function Footer({
  currency,
  onCurrencyChange,
}: {
  currency: 'INR' | 'USD' | 'EUR'
  onCurrencyChange: (c: 'INR' | 'USD' | 'EUR') => void
}) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        {/* Brand column */}
        <div className="footer-brand">
          <Link to="/" className="wordmark footer-wordmark">
            <span>MONOCHROME</span>
            <small>STUDIO</small>
          </Link>
          <p>
            Considered essentials.
            <br />
            Designed to last.
          </p>
          <div className="flex gap-4 items-center mt-4">
            <a
              className="social-link"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>

        {/* Explore */}
        <div className="footer-column">
          <span className="footer-heading">Collections</span>
          <Link to="/shop">All Silhouettes</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/women">Women’s Edit</Link>
          <Link to="/men">Men’s Edit</Link>
          <Link to="/collections">Everyday Essentials</Link>
        </div>

        {/* Customer Care */}
        <div className="footer-column">
          <span className="footer-heading">Customer Care</span>
          <a href="mailto:concierge@monochromestudio.in">Studio Concierge</a>
          <Link to="/journal">Shipping &amp; Delivery</Link>
          <Link to="/journal">Returns &amp; Exchanges</Link>
          <Link to="/account">My Client Portal</Link>
          <Link to="/wishlist">Saved Pieces</Link>
        </div>

        {/* Service & Currencies */}
        <div className="footer-column footer-service">
          <span className="footer-heading">Atelier Details</span>
          <Link to="/journal">Sustainability &amp; Fibers</Link>
          <Link to="/journal">Privacy &amp; Terms</Link>
          <Link to="/admin" className="text-[#8C7D70] hover:text-white flex items-center gap-1">
            <Settings size={13} /> Studio Merchant SaaS
          </Link>

          <div className="pt-2">
            <span className="text-xs uppercase text-[#7E7870] block mb-1">Currency:</span>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as any)}
              className="bg-[#242424] text-white text-xs border border-[#3E3E3E] p-1.5 outline-none"
            >
              <option value="INR">India · INR (₹)</option>
              <option value="USD">United States · USD ($)</option>
              <option value="EUR">Europe · EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 {storefrontConfig.brand.name}. All rights reserved.</span>
        <span>Thoughtfully made for modern living.</span>
        <a href="#main-content">Back to Top ↑</a>
      </div>
    </footer>
  )
}
