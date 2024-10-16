package com.example.e_commerceapp

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ViewAndSearchAll : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var productAdapter: ProductAdapter
    private lateinit var searchbar: EditText
    private val productList = mutableListOf<Product>()
    private val filteredProductList = mutableListOf<Product>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_and_search_all)

        recyclerView = findViewById(R.id.NewerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2)

        searchbar = findViewById(R.id.searchbar)

        fetchProducts()

        searchbar.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterProducts(s.toString())
            }

            override fun afterTextChanged(s: Editable?) {}
        })

        val fab: FloatingActionButton = findViewById(R.id.fab)
        fab.contentDescription = "Add item"

    }

    private fun fetchProducts() {
        val apiService = RetrofitInstance.api
        apiService.getProducts().enqueue(object : Callback<List<Product>> {
            override fun onResponse (call: Call<List<Product>>, response: Response<List<Product>>){
                if (response.isSuccessful && response.body() != null) {
                    // Limit to 100 products
                    val products = response.body()!!.take(100)
                    productList.clear()
                    productList.addAll(products)
                    filteredProductList.addAll(productList)
                    productAdapter = ProductAdapter(filteredProductList)
                    recyclerView.adapter = productAdapter
                }
            }

            override fun onFailure(call: Call<List<Product>>, t: Throwable) {
                // Handle failure
                t.printStackTrace()
            }
        })
    }

    private fun filterProducts(query: String) {
        val filteredList = if (query.isEmpty()) {
            productList
        } else {
            productList.filter { it.ProductName.contains(query, ignoreCase = true) }
        }
        filteredProductList.clear()
        filteredProductList.addAll(filteredList)
        productAdapter.notifyDataSetChanged() // Notify adapter to refresh
    }
}