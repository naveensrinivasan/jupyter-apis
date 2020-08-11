module github.com/StatCan/jupyter-apis

go 1.14

require (
	github.com/StatCan/kubeflow-controller v0.0.0-20200805150330-c19fa4b0fcb6
	github.com/andanhm/go-prettytime v1.0.0
	github.com/gorilla/handlers v1.4.2
	github.com/gorilla/mux v1.7.4
	github.com/hashicorp/vault/api v1.0.4 // indirect
	github.com/imdario/mergo v0.3.10 // indirect
	github.com/kr/pretty v0.2.0 // indirect
	golang.org/x/crypto v0.0.0-20200709230013-948cd5f35899 // indirect
	golang.org/x/net v0.0.0-20200707034311-ab3426394381 // indirect
	golang.org/x/oauth2 v0.0.0-20200107190931-bf48bf16ab8d // indirect
	golang.org/x/time v0.0.0-20200630173020-3af7569d3a1e // indirect
	k8s.io/api v0.18.6
	k8s.io/apimachinery v0.18.6
	k8s.io/client-go v11.0.1-0.20190409021438-1a26190bd76a+incompatible
	sigs.k8s.io/controller-runtime v0.0.0-00010101000000-000000000000
)

replace k8s.io/client-go => k8s.io/client-go v0.18.6

replace k8s.io/apiextensions-apiserver => k8s.io/apiextensions-apiserver v0.18.6

replace sigs.k8s.io/controller-runtime => sigs.k8s.io/controller-runtime v0.6.2

replace github.com/googleapis/gnostic => github.com/googleapis/gnostic v0.4.0