"""
Orchidarc — download script (v2).

Downloads what it can from the old Squarespace CDN into ./images/, then
reports exactly which filenames you still need to place manually.

Filenames are normalized: lowercased, hyphens not underscores or spaces.

Usage:
    python3 download_images.py
"""
from __future__ import annotations
import sys
import urllib.request
from pathlib import Path

SQ = "https://images.squarespace-cdn.com/content/v1/62a46ec904abd9082e732ae7"

# (local_filename, squarespace_uuid_and_path_or_None_if_manual)
IMAGES = [
    # Atmosphere / landscape
    ("hero-cloud-forest.jpg",       "32944817-46ed-41a6-9443-8d1ef5096afe/_MG_3738.JPG"),
    ("waterfall.jpg",               None),
    ("cloud-rock-habitat.jpg",      None),
    ("reserve-ixhuacan.jpg",        "0876bba9-5404-4b85-926b-56a982fc1172/IMG_20211012_123116_067.jpg"),
    ("researchers-in-canopy.jpg",   None),
    ("orchid-rescue.jpg",           None),
    ("aerial-cofre-de-perote.jpg",  "2675011b-0620-4bdb-a8e1-37f2bf667903/dji_fly_20230729_130218_0163_1690694512505_photo.jpg"),

    # Laelia anceps
    ("anceps-flowers.jpg",          None),
    ("anceps-flowers-b.jpg",        None),
    ("anceps-cliff.jpg",            None),
    ("anceps-forest.jpg",           None),
    ("anceps-situ.jpg",             None),
    ("anceps-situ-flower.jpg",      None),
    ("anceps-day-of-the-dead.jpg",  None),
    ("l-anceps-insitu.jpg",         None),
    ("l-anceps-insitu-2.jpg",       None),

    # Laelia halbingeriana
    ("l-halbingeriana.jpg",             None),
    ("l-halbingeriana-a.jpg",           None),
    ("l-halbingeriana-b.jpg",           None),
    ("l-halbingeriana-c.jpg",           None),
    ("l-halbingeriana-d.jpg",           None),
    ("l-halbingeriana-e.jpg",           None),
    ("andres-with-halbingeriana.jpg",   None),

    # Laelia furfuracea
    ("furfuracea-grand.jpg",        None),
    ("furfuracea-situ.jpg",         None),
    ("furfuracea-situ-b.jpg",       None),
    ("l-furfuracea-insitu.jpg",     None),
    ("laelia-furfuracea.jpg",       None),

    # Laelia speciosa / albida
    ("laelia-speciosa.jpg",         None),
    ("l-speciosa.jpg",              None),
    ("laelia-albida-black.jpg",     None),
    ("albida-2-5-3.jpg",            None),

    # Acineta barkeri
    ("acineta-barkeri.jpg",             "51577823-8a96-4df3-a8f1-33b062be46f5/20220820_110655.jpg"),
    ("acineta-barkeri-front.jpg",       None),
    ("acineta-barkeri-flowers.jpg",     None),
    ("acineta-barkeri-insitu.jpg",      None),
    ("acineta-barkeri-canopy.jpg",      None),
    ("acineta-barkeri-ground.jpg",      None),
    ("acineta-barkeri-trade.jpg",       None),
    ("acineta-barkeri-trade-b.jpg",     None),

    # Cypripedium
    ("cypripedium.jpg",             "dc08b386-fdac-4732-975e-bf8facc28075/Cypripedium+rex"),
    ("cypripedium-a.jpg",           None),
    ("cypripedium-b.jpg",           None),
    ("cypripedium-molle.jpg",       None),
    ("cypripedium-size-comp.jpg",   None),
    ("cypripedium-size-comp-b.jpg", None),

    # × Dinedema mariae
    ("dinedema-mariae.jpg",         "b351d6ee-bb66-4cab-ab29-8af5f3884d91/Dinedema+3+final.jpg"),
    ("dinedema-b.jpg",              None),
    ("dinedema-moreflowers.jpg",    None),

    # Prosthechea
    ("prosthechea-vitellina.jpg",       "b61eb90a-1f9f-4d62-b570-4fd3b258b4b2/IMG_20211012_123115_940.jpg"),
    ("prosthechea-vitellina-situ.jpg",  None),
    ("prosthechea-cochleata.jpg",       None),

    # Epidendrum parkinsonianum
    ("epi-parkinsonianum.jpg",          None),
    ("epi-parkinsonianum-grand.jpg",    None),
    ("epi-parkinsonianum-grand-b.jpg",  None),
    ("epidendrum-insitu.jpg",           None),
    ("epidendrum-insitu-2.jpg",         None),

    # Lepanthes
    ("lepanthes-1.jpg",             None),
    ("lepanthes-b.jpg",             None),
    ("lepanthes-mini.jpg",          None),
    ("lepanthes-sch.jpg",           None),

    # Rhynchostele
    ("rhynchostele-maculata.jpg",       None),
    ("rhynchostele-membranacea.jpg",    None),
    ("rhynchostele-membranacea-b.jpg",  None),

    # Herbarium singles
    ("acianthera.jpg",              None),
    ("alamania.jpg",                None),
    ("alamania-b.jpg",              None),
    ("artorima.jpg",                None),
    ("bletia-adenocarpa.jpg",       None),
    ("bletia-and-orchid.jpg",       None),
    ("coelia-macrostachya.jpg",     None),
    ("cranichis.jpg",               None),
    ("funkiella.jpg",               None),
    ("gongora-galeata.jpg",         None),
    ("habenaria.jpg",               None),
    ("meiracyllium.jpg",            None),
    ("mormodes-maculata.jpg",       "bb4dcbf9-a46c-48b7-8444-0b5e1109a5a3/Mormodes+maculata.jpg"),
    ("pabstiella.jpg",              "9dce98c5-ffb7-459c-bd06-bb1a91903181/Pabistellia+biriricensis+web2+3.jpg"),
    ("pabstiella-b.jpg",            None),
    ("p-karwinskii.jpg",            None),
    ("pleurothallis.jpg",           None),
    ("trichosalpinx.jpg",           None),
    ("superbiens-flowers.jpg",      None),
    ("unknown-species.jpg",         None),
    ("unknown-species-insitu.jpg",  None),

    # Ophrys (essay)
    ("ophrys-apifera.jpg",          "6143ad45-1407-4b01-835d-cacd7492e892/Ophrys+apifera.png"),
    ("bee-orchid-diagram.png",      "9beef872-784c-4aef-b7c0-428bbb66be54/Diapositiva2.PNG"),

    # Films
    ("film-lily-of-allsaints.jpg",  "2c4ae757-930d-4c8a-8390-058ed4dd8f90/1.png"),
    ("film-spring-orchids.jpg",     "27f7d05c-4973-4cf7-825c-f5c67a074fd6/Spring+Orchids+tn.png"),

    # Store / tour
    ("laelia-collection.jpg",       "7cc08598-4f5a-463d-8492-995347526ad8/Orchidshirts13.jpg"),
    ("laelia-collection-b.jpg",     None),
    ("laelia-collection-c.jpg",     None),
    ("summer-tour.png",             None),

    # Research: RAR Climate Replicator + bioadhesive
    ("climate-simulator.jpg",       None),
    ("climate-simulator-b.jpg",     None),
    ("climate-simulator-c.jpg",     None),
    ("climate-simulator-d.jpg",     None),
    ("stigmatic-gel-diagram.png",   None),
]

OUT_DIR = Path(__file__).parent / "images"


def fetch(url: str, dest: Path) -> int:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (OrchidarcSiteMigration/1.0)",
            "Accept": "image/*",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as f:
        data = r.read()
        f.write(data)
        return len(data)


def main() -> int:
    OUT_DIR.mkdir(exist_ok=True)
    auto = [(l, p) for l, p in IMAGES if p]
    manual = [l for l, p in IMAGES if not p]

    print(f"Orchidarc image migration")
    print(f"{'─' * 50}")
    print(f"{len(auto)} auto-downloadable | {len(manual)} to place manually\n")

    print("Auto-downloading from Squarespace:\n")
    ok, skipped, failed = 0, 0, 0
    for local, remote in auto:
        dest = OUT_DIR / local
        if dest.exists() and dest.stat().st_size > 0:
            print(f"  ✓ {local}  (exists — skipped)")
            skipped += 1
            continue
        try:
            size = fetch(f"{SQ}/{remote}", dest)
            print(f"  ✓ {local}  ({size/1024:,.0f} KB)")
            ok += 1
        except Exception as e:
            print(f"  ✗ {local}  FAILED — {e}")
            failed += 1

    print(f"\n  Downloaded: {ok}  |  Skipped: {skipped}  |  Failed: {failed}\n")

    print("Files to place manually in /images/:\n")
    still_missing = []
    for local in manual:
        dest = OUT_DIR / local
        if dest.exists() and dest.stat().st_size > 0:
            print(f"  ✓ {local}  (found)")
        else:
            print(f"  — {local}")
            still_missing.append(local)

    print()
    if still_missing:
        print(f"  → {len(still_missing)} images still needed. Drop them into")
        print(f"    the /images/ folder with EXACTLY these filenames (case-")
        print(f"    sensitive). The site will show broken image icons until")
        print(f"    they are present.")
    else:
        print("  → All expected images present. You're good.")

    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
