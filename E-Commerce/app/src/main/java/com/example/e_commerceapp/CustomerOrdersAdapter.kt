package com.example.e_commerceapp
import android.graphics.BitmapFactory
import android.util.Base64
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.e_commerceapp.databinding.ItemCustomerOrderBinding

class CustomerOrdersAdapter(private val orders: List<CustomerOrder>) :
    RecyclerView.Adapter<CustomerOrdersAdapter.OrderViewHolder>() {

    class OrderViewHolder(private val binding: ItemCustomerOrderBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(order: CustomerOrder) {
            binding.customerEmail.text = order.customerEmail
            binding.customerAddress.text = order.customerAddress
            binding.totalAmount.text = "Amount: ${order.totalAmount}"
            binding.status.text = "Status: ${order.status}"
            binding.createdDate.text = order.createdDate

            // Decode Base64 image and set it to ImageView
            val imageBytes = Base64.decode(order.imageBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            binding.productImage.setImageBitmap(bitmap)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderViewHolder {
        val binding = ItemCustomerOrderBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return OrderViewHolder(binding)
    }

    override fun onBindViewHolder(holder: OrderViewHolder, position: Int) {
        holder.bind(orders[position])
    }

    override fun getItemCount() = orders.size
}
