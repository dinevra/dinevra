package com.dinevra.pos.ui

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.dinevra.pos.ui.order.POSLayout
import com.dinevra.pos.ui.payment.PaymentFlow

@Composable
fun NavGraph() {
    val navController = rememberNavController()
    
    NavHost(navController = navController, startDestination = "pos_main") {
        composable("pos_main") {
            POSLayout(
                onCheckout = { total -> 
                    navController.navigate("payment/$total")
                }
            )
        }
        composable("payment/{totalAmount}") { backStackEntry ->
            val total = backStackEntry.arguments?.getString("totalAmount") ?: "0.0"
            PaymentFlow(
                totalAmount = total,
                onPaymentSuccess = {
                    navController.popBackStack("pos_main", false)
                },
                onCancel = {
                    navController.popBackStack()
                }
            )
        }
    }
}
