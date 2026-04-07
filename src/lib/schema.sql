CREATE TABLE IF NOT EXISTS sellers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  website_url VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prices (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES sellers(id),
  price_per_kg DECIMAL(6,2) NOT NULL,
  recorded_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(seller_id, recorded_date)
);

CREATE INDEX IF NOT EXISTS idx_prices_date ON prices(recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_prices_seller_date ON prices(seller_id, recorded_date DESC);

CREATE TABLE IF NOT EXISTS scrape_logs (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES sellers(id),
  success BOOLEAN NOT NULL,
  price_found DECIMAL(6,2),
  method VARCHAR(50),
  confidence VARCHAR(10),
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scrape_logs_date ON scrape_logs(created_at DESC);

-- Seed 18 verified operating sellers (April 2026)
INSERT INTO sellers (name, slug, website_url) VALUES
  ('Durian Delivery SG', 'durian-delivery-sg', 'https://duriandelivery.com.sg'),
  ('Durian Express Delivery', 'durian-express', 'https://durianexpressdelivery.com.sg'),
  ('The Durian Story', 'the-durian-story', 'https://thedurianstory.com.sg'),
  ('Jiak Durian Mai', 'jiak-durian-mai', 'https://jiakdurianmai.com'),
  ('Kungfu Durian', 'kungfu-durian', 'https://kungfudurian.sg'),
  ('Durian Empire', 'durian-empire', 'https://durianempire.sg'),
  ('MK Musang King', 'mk-musang-king', 'https://mkmusangking.com'),
  ('Smelly Story Durian', 'smelly-story', 'https://smellystorydurian.sg'),
  ('Fresh Durian', 'fresh-durian', 'https://freshdurian.com.sg'),
  ('99 Old Trees', '99-old-trees', 'https://99oldtrees.com'),
  ('Spike''s Durian', 'spikes-durian', 'https://www.spikedurian.sg'),
  ('Uncle Sam Durian', 'uncle-sam-durian', 'https://www.unclesamdurian.com'),
  ('Combat Durian', 'combat-durian', 'https://www.facebook.com/p/Combat-Durian-Singapore-100064726054699/'),
  ('Luv Durian', 'luv-durian', 'https://www.facebook.com/ubidurian/'),
  ('Lexus Durian King', 'lexus-durian', 'https://www.facebook.com/Lexus.durianking/'),
  ('Durian SG Prime', 'durian-sg-prime', 'https://www.facebook.com/duriansgprime/'),
  ('Kong Lee Hup Kee', 'kong-lee-hup-kee', 'https://www.facebook.com/KongLeeHupKeeTrading/'),
  ('Durian Kaki', 'durian-kaki', 'https://www.facebook.com/duriankaki.sg/')
ON CONFLICT (slug) DO NOTHING;
