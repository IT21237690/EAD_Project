package com.example.e_commerceapp
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CustomerOrdersViewModel : ViewModel() {
    private val _customerOrders = MutableLiveData<List<CustomerOrder>>()
    val customerOrders: LiveData<List<CustomerOrder>> get() = _customerOrders

    fun fetchCustomerOrders() {
            RetrofitInstance.api.getCustomerOrders().enqueue(object : Callback<List<CustomerOrder>> {
            override fun onResponse(
                call: Call<List<CustomerOrder>>,
                response: Response<List<CustomerOrder>>
            ) {
                if (response.isSuccessful) {
                    _customerOrders.value = response.body()
                }

            }

            override fun onFailure(call: Call<List<CustomerOrder>>, t: Throwable) {
                // Handle the error
            }
        })
    }
}
