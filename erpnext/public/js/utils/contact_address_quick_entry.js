frappe.provide("frappe.ui.form");

frappe.ui.form.ContactAddressQuickEntryForm = class ContactAddressQuickEntryForm extends (
    frappe.ui.form.QuickEntryForm
) {
    constructor(doctype, after_insert, init_callback, doc, force) {
        super(doctype, after_insert, init_callback, doc, force);
        this.skip_redirect_on_error = true;
    }

    render_dialog() {
        this.mandatory = this.mandatory.concat(this.get_variant_fields());
        super.render_dialog();

        this.dialog.fields_dict['city'].df.onchange = () => {
            let city = this.dialog.fields_dict['city'].get_value(); // Lấy giá trị thành phố
            this.dialog.fields_dict['county'].set_value(null);
            this.dialog.fields_dict['county'].get_query = () => {
                return {
                    filters: {
                        'ma_tinh_thanh': city // Lọc quận/huyện theo thành phố đã chọn
                    }
                };
            };
        };

        this.dialog.fields_dict['county'].df.onchange = () => {
            let county = this.dialog.fields_dict['county'].get_value(); // Lấy giá trị thành phố
            this.dialog.fields_dict['address_line2'].set_value(null);
            this.dialog.fields_dict['address_line2'].get_query = () => {
                return {
                    filters: {
                        'ma_quan_huyen': county // Lọc quận/huyện theo thành phố đã chọn
                    }
                };
            };
        };
    }

    insert() {
        /**
         * Using alias fieldnames because the doctype definition define "email_id" and "mobile_no" as readonly fields.
         * Therefor, resulting in the fields being "hidden".
         */
        const map_field_names = {
            email_address: "email_id",
            mobile_number: "mobile_no",
        };
        console.log(this.dialog.doc)
        Object.entries(map_field_names).forEach(([fieldname, new_fieldname]) => {
            this.dialog.doc[new_fieldname] = this.dialog.doc[fieldname];
            delete this.dialog.doc[fieldname];
        });

        return super.insert();
    }

    get_variant_fields() {
        var variant_fields = [
            {
                fieldtype: "Section Break",
                label: __("Primary Contact Details"),
                collapsible: 1,
            },
            {
                label: __("Email Id"),
                fieldname: "email_address",
                fieldtype: "Data",
                options: "Email",
            },
            {
                fieldtype: "Column Break",
            },
            {
                label: __("Mobile Number"),
                fieldname: "mobile_number",
                fieldtype: "Data",
            },
            {
                fieldtype: "Section Break",
                label: __("Primary Address Details"),
                collapsible: 1,
            },
            {
                label: __("Country"),
                fieldname: "country",
                fieldtype: "Link",
                options: "Country",
            },
            {
                label: __("City"),
                fieldname: "city",
                fieldtype: "Link",
                options: "DMS Province",

            },
            {
                label: __("County"),
                fieldname: "county",
                fieldtype: "Link",
                options: "DMS District"
            },
            {
                fieldtype: "Column Break",
            },
            {
                label: __("Address Line 2"),
                fieldname: "state",
                fieldtype: "Link",
                options: "DMS Ward"
            },
            {
                label: __("Address Line 1"),
                fieldname: "address_line1",
                fieldtype: "Data",
            },
            {
                label: __("ZIP Code"),
                fieldname: "pincode",
                fieldtype: "Data",
            },
            {
                label: __("Customer POS Id"),
                fieldname: "customer_pos_id",
                fieldtype: "Data",
                hidden: 1,
            },
        ]

        return variant_fields;
    }
};
