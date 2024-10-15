package com.example.e_commerceapp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import android.util.Base64
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.content.Intent
import android.util.Log

class ProductAdapter(private val productList: List<Product>) :
    RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {

    class ProductViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imageView: ImageView = itemView.findViewById(R.id.imageView4)
        val titleText: TextView = itemView.findViewById(R.id.ItemTitleText)
        val priceText: TextView = itemView.findViewById(R.id.priceTag)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.viewholder_pup_list, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = productList[position]
        holder.titleText.text = product.ProductName
        holder.priceText.text = "LKR ${product.Price}"

        // Decode base64 image
        val imageBytes = Base64.decode(product.ImageBase64, Base64.DEFAULT)
        val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
        holder.imageView.setImageBitmap(bitmap)

        holder.imageView.setOnClickListener{
            Log.d("ProductAdapter", "Product ID to pass: ${product.Id}")
            val intent = Intent(holder.itemView.context, ViewProduct::class.java).apply {
                val product = productList[position]
                putExtra("PRODUCT_ID", product.Id)
            }
            holder.itemView.context.startActivity(intent)
        }
    }



    override fun getItemCount() = productList.size
}