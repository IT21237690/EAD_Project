package com.example.ead_pasindu

// OrderAdapter.kt
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.ead_pasindu.models.Order
import com.example.ead_pasindu.R

class OrderAdapter(private val orders: List<Order>) : RecyclerView.Adapter<OrderAdapter.OrderViewHolder>() {

    // Create a ViewHolder to describe an item view and metadata about its place within the RecyclerView
    class OrderViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val orderId: TextView = view.findViewById(R.id.orderId)
        val orderStatus: TextView = view.findViewById(R.id.orderStatus)
        val orderTotal: TextView = view.findViewById(R.id.orderTotal)
    }

    // Inflate the layout for each order item in the list
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_order, parent, false)
        return OrderViewHolder(view)
    }

    // Bind the order data to each item in the RecyclerView
    override fun onBindViewHolder(holder: OrderViewHolder, position: Int) {
        val order = orders[position]
        holder.orderId.text = "Order ID: ${order.id}"
        holder.orderStatus.text = "Status: ${order.status}"
        holder.orderTotal.text = "Total: $${order.totalAmount}"
    }

    // Return the total number of items in the dataset
    override fun getItemCount(): Int {
        return orders.size
    }
}
