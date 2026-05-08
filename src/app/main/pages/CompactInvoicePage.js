import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

function CompactInvoicePage() {
  return (
    <div className="inline-block  sm:p-40 text-left print:p-0 w-full overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ bounceDamping: 0 }}
      >
        <Card className="w-xl p-64 mx-auto rounded-2xl shadow print:w-auto print:rounded-none print:shadow-none print:bg-transparent">
          <CardContent className="">
            <div className="grid grid-cols-12 gap-x-4 mt-48">
              <div className="col-span-8 font-medium text-md" color="text.secondary">
                SERVICE
              </div>
              <div className="font-medium text-md text-right" color="text.secondary">
                RATE
              </div>
              <div className="font-medium text-md text-right" color="text.secondary">
                QTY
              </div>
              <div className="col-span-2 font-medium text-md text-right" color="text.secondary">
                TOTAL
              </div>

              <div className="col-span-12 my-16 border-b" />

              <Typography className="col-span-8 text-lg font-medium">Prototype & Design</Typography>
              <Typography className="self-center text-right">$75.00</Typography>
              <Typography className="self-center text-right">240</Typography>
              <Typography className="col-span-2 self-center text-right">$18,000.00</Typography>

              <div className="col-span-12 my-16 border-b" />

              <Typography className="col-span-8 text-lg font-medium">Development</Typography>
              <Typography className="self-center text-right">$60.50</Typography>
              <Typography className="self-center text-right">350</Typography>
              <Typography className="col-span-2 self-center text-right">$21,175.00</Typography>

              <div className="col-span-12 my-16 border-b" />

              <Typography className="col-span-8 text-lg font-medium">Testing</Typography>
              <Typography className="self-center text-right">$25.00</Typography>
              <Typography className="self-center text-right">50</Typography>
              <Typography className="col-span-2 self-center text-right">$1,250.00</Typography>

              <div className="col-span-12 my-16 border-b" />

              <Typography className="col-span-8 text-lg font-medium">
                Documentation & Training
              </Typography>
              <Typography className="self-center text-right">$26.50</Typography>
              <Typography className="self-center text-right">260</Typography>
              <Typography className="col-span-2 self-center text-right">$6,890.00</Typography>

              <div className="col-span-12 my-16 border-b" />

              <div className="col-span-8 text-lg font-medium">Critical bug fixes for a year</div>
              <div className="self-center text-right">$25,000</div>
              <div className="self-center text-right">2</div>
              <div className="col-span-2 self-center text-right">$50,000.00</div>

              <div className="col-span-12 my-16 border-b" />

              <Typography className="col-span-8 text-lg font-medium">
                Extended security updates for a year
              </Typography>
              <Typography className="self-center text-right">$15.000</Typography>
              <Typography className="self-center text-right">2</Typography>
              <Typography className="col-span-2 self-center text-right">$30,000.00</Typography>

              <div className="col-span-12 my-16 border-b" />

              <Typography className="col-span-8 text-lg font-medium">
                Extended updates for a year
              </Typography>
              <Typography className="self-center text-right">$50.000</Typography>
              <Typography className="self-center text-right">2</Typography>
              <Typography className="col-span-2 self-center text-right">$100,000.00</Typography>

              <div className="col-span-12 mt-64" />

              <Typography
                className="col-span-10 self-center font-medium tracking-tight"
                color="text.secondary"
              >
                SUBTOTAL
              </Typography>
              <Typography className="col-span-2 text-right text-lg">$227,315.00</Typography>

              <div className="col-span-12 my-12 border-b" />

              <Typography
                className="col-span-10 self-center font-medium tracking-tight"
                color="text.secondary"
              >
                TAX
              </Typography>
              <Typography className="col-span-2 text-right text-lg">$11,365.75</Typography>

              <div className="col-span-12 my-12 border-b" />

              <Typography
                className="col-span-10 self-center font-medium tracking-tight"
                color="text.secondary"
              >
                DISCOUNT
              </Typography>
              <Typography className="col-span-2 text-right text-lg">$3,680.75</Typography>

              <div className="col-span-12 my-12 border-b" />

              <Typography
                className="col-span-10 self-center text-2xl font-medium tracking-tight"
                color="text.secondary"
              >
                TOTAL
              </Typography>
              <div className="col-span-2 text-right text-2xl font-medium">$235,000.00</div>
            </div>

            <div className="mt-64">
              <Typography className="font-medium">
                Please pay within 15 days. Thank you for your business.
              </Typography>
              <div className="flex items-start mt-16">
                <img className="flex-0 w-40 mt-8" src="assets/images/logo/logo.svg" alt="logo" />
                <Typography className="ml-24 text-sm" color="text.secondary">
                  In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut ac congue
                  dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras aliquet facilisis
                  pellentesque. Nunc hendrerit quam at leo commodo, a suscipit tellus dapibus. Etiam
                  at felis volutpat est mollis lacinia. Mauris placerat sem sit amet velit mollis,
                  in porttitor ex finibus. Proin eu nibh id libero tincidunt lacinia et eget.
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default CompactInvoicePage;

/**

 Use the following elements to add breaks to your pages. This will make sure that the section in between
 these elements will be printed on a new page. The following two elements must be used before and after the
 page content that you want to show as a new page. So, you have to wrap your content with them.

 Elements:
 ---------
 <div className="page-break-after"></div>
 <div className="page-break-before"></div>


 Example:
 --------

 Initial page content!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>

 This is the second page!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>

 This is the third page!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>
 * */
