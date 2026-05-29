import React from 'react';
import { ShoppingBag, Settings2, ArrowUpRight } from 'lucide-react';
import './storeTab.css';

const MyShopTab = ({ isOwner, shopProductsData }) => {
  
  // Strict UI Filter Constraint Layout Layer Rule: Limit storefront preview output to 4 items max
  const limitedProductsList = shopProductsData ? shopProductsData.slice(0, 4) : [];

  const handleStoreRedirect = () => {
    if (isOwner) {
      console.log("Navigating profile owner to their central Marketplace Shop Dashboard panel...");
    } else {
      console.log("Redirecting profile visitor to this student's public marketplace storefront track...");
    }
  };

  return (
    <div className="my-shop-tab-wrapper">
      
      {/* 1. CENTRALIZED SECTION HEADER WITH ALIGNED REDIRECT LINK */}
      <div className="my-shop-tab-master-header">
        <h2>My Shop</h2>
        
        {/* NEW REPOSITIONED TOP RIGHT ACTION TRIGGER */}
        <button 
          type="button" 
          className="shop-storefront-header-redirect-btn"
          onClick={handleStoreRedirect}
        >
          <span>{isOwner ? "Manage Store" : "Visit Store"}</span>
          <ArrowUpRight className="redirect-btn-svg" />
        </button>
      </div>

      {/* 2. DYNAMIC GRID CANVAS DISPLAY */}
      <div className="shop-products-preview-grid">
        {limitedProductsList.length > 0 ? (
          limitedProductsList.map((product) => (
            <div key={product.id} className="product-preview-card">
              
              {/* Product Thumbnail Frame Image Core */}
              <div className="product-thumbnail-frame">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="product-thumbnail-image" />
                ) : (
                  <ShoppingBag size={24} strokeWidth={1.5} />
                )}

                {/* CONDITIONAL ACTION BUBBLE: Manage triggers exposed only to the Owner profile context */}
                {isOwner && (
                  <div className="product-owner-inline-action">
                    <button 
                      type="button" 
                      className="product-inline-naked-btn" 
                      onClick={() => console.log(`Trigger Item Editing for Product ID: ${product.id}`)}
                      aria-label="Manage item details"
                    >
                      <Settings2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Text Description details */}
              <div className="product-card-details-box">
                <h4>{product.title || "Unregistered Product"}</h4>
                <p className="product-item-price-tag">{product.price || "₦0.00"}</p>
              </div>

            </div>
          ))
        ) : (
          <div className="placeholder-panel-text" style={{ gridColumn: '1 / -1', padding: '32px 0', textAlign: 'center' }}>
            <p>No inventory profiles uploaded on this user storefront account space yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyShopTab;