from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT=Path(__file__).resolve().parents[1]; SHOT=ROOT/"screenshots"; I05=ROOT.parent/"pressure-proof-constructed-signal-iteration-05"/"screenshots"; FONT=ImageFont.load_default()
SURFACES=[("01-home","HOME"),("02-vape-nicotine-division","VAPE & NICOTINE"),("03-shared-category","CATEGORY"),("04-universal-pdp","UNIVERSAL PDP"),("05-fitted-component-pdp","FITTED PDP"),("06-quick-cart","QUICK CART"),("07-full-cart","FULL CART"),("08-thca-division","THCA"),("09-glass-accessories-division","GLASS & ACCESSORIES"),("10-search","SEARCH")]
COMPARE=[("01-home","HOME"),("02-vape-nicotine-division","VAPE & NICOTINE"),("03-shared-category","CATEGORY"),("04-universal-pdp","UNIVERSAL PDP"),("06-quick-cart","QUICK CART")]

def cover(im,size):
 im=im.convert("RGB");s=max(size[0]/im.width,size[1]/im.height);im=im.resize((round(im.width*s),round(im.height*s)),Image.Resampling.LANCZOS);return im.crop(((im.width-size[0])//2,0,(im.width-size[0])//2+size[0],size[1]))
def cell(path,label,size,gray=False,brand_reduce=False):
 im=Image.open(path).convert("RGB"); im=cover(im,(size[0],size[1]-32));
 if gray: im=ImageOps.grayscale(im).convert("RGB")
 if brand_reduce: ImageDraw.Draw(im).rectangle((0,0,im.width,110),fill="#b8b8b8")
 out=Image.new("RGB",size,"#f3efe7");out.paste(im,(0,32));d=ImageDraw.Draw(out);d.rectangle((0,0,size[0],31),fill="#11110f");d.text((8,10),label,font=FONT,fill="white");return out
def contain(path,label,size):
 im=Image.open(path).convert("RGB"); target=(size[0]-20,size[1]-52); im.thumbnail(target,Image.Resampling.LANCZOS); out=Image.new("RGB",size,"#f3efe7"); out.paste(im,((size[0]-im.width)//2,42)); d=ImageDraw.Draw(out);d.rectangle((0,0,size[0],31),fill="#11110f");d.text((8,10),label,font=FONT,fill="white");return out
def compare(stem,label,narrow=False):
 size=(360,760) if narrow else (680,760); board=Image.new("RGB",(size[0]*2+50,size[1]+70),"#d8d3ca");d=ImageDraw.Draw(board);d.text((20,16),f"{label} / ITERATION 05 vs 05.1",font=FONT,fill="#11110f");old=I05/("narrow" if narrow else "wide")/f"{stem}-{'390x844' if narrow else '1440x900'}.png";new=SHOT/("narrow" if narrow else "wide")/f"{stem}-{'390x844' if narrow else '1440x900'}.png";board.paste(cell(old,"ITERATION 05",size),(20,48));board.paste(cell(new,"ITERATION 05.1",size),(30+size[0],48));out=SHOT/"comparison"/("narrow" if narrow else "wide")/f"{stem}-iter05-vs-iter05-1.png";out.parent.mkdir(parents=True,exist_ok=True);board.save(out,optimize=True)
def overview(gray=False):
 size=(300,350);board=Image.new("RGB",(size[0]*5+70,size[1]*2+90),"#d8d3ca");d=ImageDraw.Draw(board);d.text((20,16),"ITERATION 05.1 / ALL TEN OPENINGS"+(" / GRAYSCALE" if gray else ""),font=FONT,fill="#11110f");
 for i,(stem,label) in enumerate(SURFACES):board.paste(cell(SHOT/"wide"/f"{stem}-1440x900.png",label,size,gray),(20+i%5*(size[0]+6),48+i//5*(size[1]+6)))
 board.save(SHOT/"overview"/("all-ten-grayscale-openings.png" if gray else "all-ten-default-openings.png"),optimize=True)
def simple_board(name,title,items,size=(420,420)):
 board=Image.new("RGB",(len(items)*size[0]+40,size[1]+70),"#d8d3ca");d=ImageDraw.Draw(board);d.text((20,16),title,font=FONT,fill="#11110f");
 for i,item in enumerate(items):
  p,l,*flags=item; board.paste(cell(p,l,size,gray="gray" in flags,brand_reduce="brand" in flags),(20+i*size[0],48))
 board.save(SHOT/"overview"/name,optimize=True)
def contained_board(name,title,items,size=(520,620)):
 board=Image.new("RGB",(len(items)*size[0]+40,size[1]+70),"#d8d3ca");d=ImageDraw.Draw(board);d.text((20,16),title,font=FONT,fill="#11110f")
 for i,(p,l) in enumerate(items):board.paste(contain(p,l,size),(20+i*size[0],48))
 board.save(SHOT/"overview"/name,optimize=True)
def main():
 (SHOT/"overview").mkdir(parents=True,exist_ok=True)
 for stem,label in COMPARE:compare(stem,label);compare(stem,label,True)
 overview();overview(True)
 simple_board("home-anti-generic-comparison.png","HOME / WIDE OPENING / COLOR + GRAYSCALE + BRAND-REDUCED",[(I05/"wide/01-home-1440x900.png","I05 COLOR"),(SHOT/"wide/01-home-1440x900.png","I05.1 COLOR"),(SHOT/"wide/01-home-1440x900.png","I05.1 GRAYSCALE","gray"),(SHOT/"wide/01-home-1440x900.png","I05.1 BRAND-REDUCED","brand")],(330,420))
 simple_board("home-anti-generic-narrow.png","HOME / 390 OPENING / COLOR + GRAYSCALE + BRAND-REDUCED",[(I05/"narrow/01-home-390x844.png","I05 COLOR"),(SHOT/"narrow/01-home-390x844.png","I05.1 COLOR"),(SHOT/"narrow/01-home-390x844.png","I05.1 GRAYSCALE","gray"),(SHOT/"narrow/01-home-390x844.png","I05.1 BRAND-REDUCED","brand")],(260,520))
 contained_board("typography-candidate-comparison.png","TYPOGRAPHY CANDIDATES / HOME + UNIVERSAL PDP",[(SHOT/"states/typography-correction-1440x900.png","ARCHIVO + HELVETICA")],(980,720))
 simple_board("route-destination-map.png","ROUTE DESTINATIONS",[(SHOT/"wide/08-thca-division-1440x900.png","THCA"),(SHOT/"wide/09-glass-accessories-division-1440x900.png","GLASS"),(SHOT/"wide/10-search-1440x900.png","SEARCH")])
 contained_board("category-assortment-balance.png","CATEGORY / COMPLETE GRID / 5 RESOLVED + 1 CAUTION + 2 BLOCKERS",[(SHOT/"wide/03-shared-category-1440x900.png","PRINCIPAL GRID")],(920,820))
 contained_board("pdp-cart-continuity.png","FITTED PDP TO QUICK CART TO FULL CART",[(SHOT/"wide/05-fitted-component-pdp-1440x900.png","PDP"),(SHOT/"wide/06-quick-cart-1440x900.png","QUICK CART"),(SHOT/"wide/07-full-cart-1440x900.png","FULL CART")],(420,760))
if __name__=="__main__":main()
